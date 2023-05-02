import Page from "./Page";

export interface IStats {
    timestamp: Date,
    totalNetworkRequests: number;
    maxDepth: number;
    duration: number;
}

function About(props: { stats: IStats }) {
    const { stats } = props;

    return (
        <>
            <p>I built Static News to solve a habit problem that I have with Hacker News. Static News only contains the top stories and comments from the previous day, which helps mitigate the pressure to check it throughout the day, at least for me anyways.</p>
            <p>Some features:</p>
            <ul>
                <li>No JavaScript, entirely statically generated HTML/CSS</li>
                <li>Fully hydrated comments</li>
                <li>Collapsible comments</li>
                <li>Comment tree traversal (root / parent / prev / next)</li>
                <li>Limited stories & comments</li>
                <li>No escape hatch to Hacker News (unless user content explicitly links there)</li>
            </ul>
            <p>Deployment is just a scheduled GitHub Action, which happens at 09:00 UTC every day. You can fork this repo and tweak the values/theme to whatever you'd like <a href="https://github.com/sbuggay/staticnews">https://github.com/sbuggay/staticnews</a>.</p>
            <p>Page built: {stats.timestamp.toLocaleString()}</p>
            <table>
                <tr>
                    <td>Build time</td>
                    <td>{stats.duration}ms</td>
                </tr>
                <tr>
                    <td>Total network requests</td>
                    <td>{stats.totalNetworkRequests}</td>
                </tr>
                <tr>
                    <td>Max comment depth</td>
                    <td>{stats.maxDepth}</td>
                </tr>
            </table>
        </>);
}

export default About;