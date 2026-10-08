// Exercise 33-1 · stands in for a third-party analytics tag. Nothing on the page depends on it.
window.analyticsQueue = window.analyticsQueue || [];
window.analyticsQueue.push(['pageview', location.pathname, Date.now()]);
