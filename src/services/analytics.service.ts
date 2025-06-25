const API_URL = process.env.NEXT_PUBLIC_ANALYTICS_API_URL!;
const API_KEY = process.env.NEXT_PUBLIC_PLAUSIBLE_API_KEY!;
const SITE_ID = process.env.NEXT_PUBLIC_PLAUSIBLE_SITE_ID!;

const getHeaders = () => ({
  "Authorization": `Bearer ${API_KEY}`,
  "Content-Type": "application/json"
});

export async function getAllAnalytics(period = "7d") {
  const [realtime, aggregate, timeseries, topPages, countries] = await Promise.all([
    fetch(`${API_URL}/realtime?site_id=${SITE_ID}`, { headers: getHeaders() }).then(r => r.json()),
    fetch(`${API_URL}/aggregate?site_id=${SITE_ID}&period=${period}&metrics=visitors,pageviews,visits,bounce_rate`, { headers: getHeaders() }).then(r => r.json()),
    fetch(`${API_URL}/timeseries?site_id=${SITE_ID}&period=${period}&metrics=visitors&dimensions=time:day`, { headers: getHeaders() }).then(r => r.json()),
    fetch(`${API_URL}/breakdown?dimensions=event:page&site_id=${SITE_ID}&period=${period}&metrics=visitors`, { headers: getHeaders() }).then(r => r.json()),
    fetch(`${API_URL}/breakdown?dimensions=visit:country_name&site_id=${SITE_ID}&period=${period}&metrics=visitors`, { headers: getHeaders() }).then(r => r.json()),
  ]);
  return { realtime, aggregate, timeseries, topPages, countries };
}