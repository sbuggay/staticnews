import Head from './Head';
import Header from './Header';

function Page(props: { children: JSX.Element }) {
    return (
        <html>
            <Head />
            <body>
                <div id="container">
                    <div id="inner">
                        <Header />
                        <div>
                            {props.children}
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}

export default Page;