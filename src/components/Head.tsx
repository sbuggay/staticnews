export default function () {
    const cacheBust = `v=${Date.now()}`;

    return <head>
        <meta charSet="utf-8"></meta>
        <meta name="viewport" content="width=device-width,initial-scale=1.0"></meta>
        <title>StaticNews</title>
        <link rel="stylesheet" href={`styles.css?${cacheBust}`}></link>
    </head>
}