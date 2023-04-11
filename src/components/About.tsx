import Page from "./Page";

export interface IStats {
    timestamp: Date,
    totalNetworkRequests: number;
    maxDepth: number;
    duration: number;
}

function About(props: { stats: IStats }) {
    const { stats } = props;

    return <Page>
        <>
            <p>Page was built at {stats.timestamp.toLocaleString()}</p>
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
                    <td>Max depth</td>
                    <td>{stats.maxDepth}</td>
                </tr>
            </table>
        </>
    </Page>
}

export default About;