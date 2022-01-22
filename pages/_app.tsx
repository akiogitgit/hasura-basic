import { ApolloProvider } from '@apollo/client'
// apolloの初期設定(Hasuraを接続)
import { initializeApollo } from '../lib/apolloClient'
import { AppProps } from 'next/app'
import '../styles/globals.css'

function MyApp({ Component, pageProps }:AppProps) {
  const client = initializeApollo()
  return (
    // 全部囲うことで、Hasuraのqueryが使える
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
    )
}

export default MyApp
