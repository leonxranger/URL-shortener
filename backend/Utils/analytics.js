import { redis } from "../Config/Redis.js"
import { CLICKS } from "../models/Clicks.js";
import { BucketReferrer } from "./BucketReferrer.js";

const RANGE_DAYS = { week: 7, month: 30, year: 365 };
const CACHE_TTL = 90;
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formatLabel = (raw, range) => {
    if (range === "week")  return raw;                                        // "2026-06-20"
    if (range === "month") return `Week ${raw + 1}`;                          // 0 → "Week 1"
    if (range === "year")  return MONTH_NAMES[Number(raw.split("-")[1]) - 1]; // "2026-06" → "Jun"
    return raw;
};

const normalizeTimeSeries = (raw, range) =>
    raw.map(point => ({ label: formatLabel(point._id, range), clicks: point.clicks }));

// sourceTimeSeries raw output:
// [{ _id: { bucket: "2026-06-20", isReferral: false }, clicks: 5 }, ...]
// reshape into: [{ label: "Jun 20", Direct: 5, Referral: 3 }, ...]
const normalizeSourceSeries = (raw, range) => {
    const grouped = {};
    for (const r of raw) {
        const label = formatLabel(r._id.bucket, range);
        if (!grouped[label]) grouped[label] = { label, Direct: 0, Referral: 0 };
        grouped[label][r._id.isReferral ? "Referral" : "Direct"] += r.clicks;
    }
    // preserve chronological order (already sorted by _id.bucket from $sort in pipeline)
    return Object.values(grouped);
};

export const getAnalytics = async (link, range) => {
    const cacheKey = `analytics:${link._id}:${range}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const StartDate = new Date(Date.now() - 24 * 60 * 60 * 1000 * RANGE_DAYS[range]);

    const GROUP_FIELD = { week: "$day", month: "$weekIndex", year: "$monthKey" }[range];

    const timeSeriesStage = [
        { $group: { _id: GROUP_FIELD, clicks: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ];

    const sourceTimeSeriesStage = [
        { $group: { _id: { bucket: GROUP_FIELD, isReferral: "$isReferral" }, clicks: { $sum: 1 } } },
        { $sort: { "_id.bucket": 1 } },
    ];

    const [result] = await CLICKS.aggregate([
        { $match: { urlID: link._id.toString(), timestamp: { $gte: StartDate } } },
        {
            $addFields: {
                day:       { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                monthKey:  { $dateToString: { format: "%Y-%m",   date: "$timestamp" } },
                weekIndex: {
                    $floor: {
                        $divide: [
                            { $dateDiff: { startDate: StartDate, endDate: "$timestamp", unit: "day" } },
                            7,
                        ],
                    },
                },
                isReferral: {
                    $cond: [
                        { $or: [{ $eq: ["$referrer", ""] }, { $eq: ["$referrer", "direct"] }] },
                        false,
                        true,
                    ],
                },
            },
        },
        {
            $facet: {
                devices:          [{ $group: { _id: "$device",  count: { $sum: 1 } } }],
                browsers:         [{ $group: { _id: "$browser", count: { $sum: 1 } } }],
                timeSeries:       timeSeriesStage,
                sourceTimeSeries: sourceTimeSeriesStage,
                referrerRaw:      [{ $group: { _id: "$referrer", count: { $sum: 1 } } }],
                countries:        [
                    { $group: { _id: "$country", clicks: { $sum: 1 } } },
                    { $sort: { clicks: -1 } },
                    { $limit: 5 },
                ],
                uniqueVisitors: [
                    { $group: { _id: null, ips: { $addToSet: "$ip" } } },
                    { $project: { count: { $size: "$ips" } } },
                ],
                total: [{ $count: "count" }],
            },
        },
    ]);

    // bucket raw referrers into categories in JS
    const referrerMap = {};
    for (const r of result.referrerRaw) {
        const bucket = BucketReferrer(r._id);
        referrerMap[bucket] = (referrerMap[bucket] || 0) + r.count;
    }

    const referrers = Object.entries(referrerMap)
        .map(([name, clicks]) => ({ name, clicks }))
        .sort((a, b) => b.clicks - a.clicks);

    const directClicks   = referrers.filter(r => r.name === "Direct").reduce((sum, r) => sum + r.clicks, 0);
    const referralClicks = referrers.filter(r => r.name !== "Direct").reduce((sum, r) => sum + r.clicks, 0);

    const payload = {
        link: {
            ShortCode:   link.short_code,
            longUrl:     link.longURL,
            createdAt:   link.created_at,
            isActive:    link.expiration_date > new Date(),
            totalClicks: link.clicks,
        },
        range: {
            timeseries:       normalizeTimeSeries(result.timeSeries, range),
            sourceTimeSeries: normalizeSourceSeries(result.sourceTimeSeries, range),
            uniqueVisitors:   result.uniqueVisitors[0]?.count ?? 0,
            devices:          result.devices.map(d => ({ name: d._id || "Desktop", value: d.count })),
            browsers:         result.browsers.map(b => ({ name: b._id || "Unknown", value: b.count })),
            referrers,
            countries:        result.countries.map(c => ({ name: c._id, clicks: c.clicks })),
            directClicks,
            referralClicks,
            total:            result.total[0]?.count ?? 0,
        },
    };

    await redis.set(cacheKey, JSON.stringify(payload), "EX", CACHE_TTL);
    return payload;
};