//this hook is used to change the title of the page as seen in the browser tab

import { useEffect } from "react"

const useTitle = (title) => {

    useEffect(() => {
        const prevTitle = document.title
        document.title = title

        return () => document.title = prevTitle
    }, [title])

}

export default useTitle