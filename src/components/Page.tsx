import Head from './Head';
import Header from './Header';

function Page(props: { children: JSX.Element }) {
    return (
        <html lang="en">
            <Head />
            <body>
                <div id="container">
                    <div id="inner">
                        <Header />
                        <div id="content">
                            {props.children}
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}

export default Page;