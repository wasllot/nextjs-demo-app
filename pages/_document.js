import * as React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";
import Script from "next/script";

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang="en">
				<Head>
				<Script strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MTCGCM8');`}}></Script>
					{/* PWA primary color */}
					<meta name="theme-color" content={theme.palette.primary.main} />
					<link rel="icon" href="/faviconb9.ico" />
					<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
					{/* Inject MUI styles first to match with the prepend: true configuration. */}
					{this.props.emotionStyleTags}
					{/*<!-- Global site tag (gtag.js) - Google Analytics -->*/}
					{/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-425RLY0LPX"></script>
					<script
						dangerouslySetInnerHTML={{
							__html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-425RLY0LPX');`,
						}}
					/> */}
					{/*Pixel experiencia.sunsetroll.com*/}
					{/*<!-- Meta Pixel Code -->*/}
					<script
						dangerouslySetInnerHTML={{
							__html: `!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '659137231827863');
            fbq('track', 'PageView');`,
						}}
					/>
					{/*<!-- Global site tag (gtag.js) - Google Analytics -->*/}
					{/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-MFL99ZMZLK"></script> */}
					{/*<!-- Global site tag (gtag.js) - Google Ads: 603539803 -->*/}
					{/* <script async src="https://www.googletagmanager.com/gtag/js?id=AW-603539803"></script>
					<script
						dangerouslySetInnerHTML={{
							__html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
  
              gtag('config', 'AW-603539803');`,
						}}
					/> */}
					<script async src="https://www.googletagmanager.com/gtag/js?id=G-1DQRKRTTY9"></script>
					<script
						dangerouslySetInnerHTML={{
							__html: `window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
						  
							gtag('config', 'G-1DQRKRTTY9');`,
						}}
					/>
					<noscript>
						<img
							height="1"
							width="1"
							style={{ display: "none" }}
							src="https://www.facebook.com/tr?id=659137231827863&ev=PageView&noscript=1"
						/>
					</noscript>
					{/*<!-- End Meta Pixel Code -->*/}
				</Head>
				<body>
		
					
					<noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MTCGCM8"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`}}></noscript>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
	// Resolution order
	//
	// On the server:
	// 1. app.getInitialProps
	// 2. page.getInitialProps
	// 3. document.getInitialProps
	// 4. app.render
	// 5. page.render
	// 6. document.render
	//
	// On the server with error:
	// 1. document.getInitialProps
	// 2. app.render
	// 3. page.render
	// 4. document.render
	//
	// On the client
	// 1. app.getInitialProps
	// 2. page.getInitialProps
	// 3. app.render
	// 4. page.render

	const originalRenderPage = ctx.renderPage;

	// You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
	// However, be aware that it can have global side effects.
	const cache = createEmotionCache();
	const { extractCriticalToChunks } = createEmotionServer(cache);

	ctx.renderPage = () =>
		originalRenderPage({
			enhanceApp: (App) =>
				function EnhanceApp(props) {
					return <App emotionCache={cache} {...props} />;
				},
		});

	const initialProps = await Document.getInitialProps(ctx);
	// This is important. It prevents emotion to render invalid HTML.
	// See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
	const emotionStyles = extractCriticalToChunks(initialProps.html);
	const emotionStyleTags = emotionStyles.styles.map((style) => (
		<style
			data-emotion={`${style.key} ${style.ids.join(" ")}`}
			key={style.key}
			// eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={{ __html: style.css }}
		/>
	));

	return {
		...initialProps,
		emotionStyleTags,
	};
};
