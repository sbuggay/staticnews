const cacheBust = `v=${Date.now()}`;

export default function () {
    return <head>
        <title>StaticNews</title>
        <meta charSet="utf-8"></meta>
        <meta name="description" content="Static delayed Hacker News."></meta>
        <meta name="viewport" content="width=device-width,initial-scale=1.0"></meta>
        <meta name="apple-mobile-web-app-capable" content="yes"></meta>
        <link rel="preload" href={`styles.css?${cacheBust}`} as="style"></link>
        <link rel="stylesheet" href={`styles.css?${cacheBust}`}></link>
    </head>
}