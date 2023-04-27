const cacheBust = `v=${Date.now()}`;

export default function () {
    return <head>
        <title>Static News</title>
        <meta charSet="utf-8"></meta>
        <meta name="description" content="Static delayed Hacker News."></meta>
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="white" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1d1f21" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0"></meta>
        <meta name="application-name" content="Static News" />
        <meta name="apple-mobile-web-app-title" content="Static News" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#1d1f21" />
        <link rel="preload" href={`styles.css?${cacheBust}`} as="style"></link>
        <link rel="stylesheet" href={`styles.css?${cacheBust}`}></link>
    </head>
}