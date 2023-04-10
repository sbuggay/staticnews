export default function () {
    const cacheBust = `v=${Date.now()}`;

    return <head>
        <link rel="stylesheet" href={`styles.css?${cacheBust}`}></link>
    </head>
}