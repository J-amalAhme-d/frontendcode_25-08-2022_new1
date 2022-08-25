import { SSRProvider } from "react-bootstrap"
import "./globals.css"
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import '../styles/nprogress.css'
import UserUtils from "../src/utils/UserUtils"
import StorageUtils from "../src/utils/StorageUtils"
import APICaller from "../api/APICaller"

function MyApp({ Component, pageProps }) {

  const router = useRouter();

  useEffect(() => {
    const handleStart = (url) => {
      console.log(`Loading: ${url}`)
      NProgress.start()
    }
    const handleStop = () => {
      NProgress.done()
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  useEffect(() => {
    console.log("App: Main app useEffect remove this!");
    
    UserUtils.getAuthenticatedUser()
      .then(u => {
        let usid = StorageUtils.getLocalStorageObject('usid');
        
        UserUtils.getUserId(u.email)
          .then(i => {
            if(usid && usid !== null && usid !== '' && usid !== i){
              if(usid !== i){
                console.log("App: User ID:",i);
                StorageUtils.setLocalStorageObject('usid',i);
              }
            } else {
              console.log("App: User ID:",i);
              StorageUtils.setLocalStorageObject('usid',i);
            }
          })
          .catch(e => {
            console.error("App: Unable to get the user id:",e);
          })
      })
      .catch(e => {
        console.error("App: Unable to fetch logged in user info",e);
      })  ;
  },[]);
  

  return (
    <SSRProvider>
      <Component {...pageProps} />
    </SSRProvider>
  )
}

export default MyApp
