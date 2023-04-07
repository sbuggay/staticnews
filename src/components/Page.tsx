import Head from './Head';
import Header from './Header';

function Page(props: { children: JSX.Element }) {
    return (
        <html>
            <Head />
            <Header />
            <body>
                {props.children}
            </body>
        </html>
    );
}

export default Page;