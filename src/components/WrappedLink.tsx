export default function WrappedLinked(props: { urlString: string }) {
    const { urlString } = props;

    if (!urlString) return null;
    const url = new URL(urlString);

    const hostname = url.hostname;
    const link = `${url.protocol}//${url.hostname}`;

    return <>
        <span>(<a href={link}>{hostname}</a>)</span>
    </>;
}