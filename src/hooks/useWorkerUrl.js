//this hook is used to change the title of the page as seen in the browser tab
import packageJson from '../../package.json'

const useWorkerUrl = () => {

    const pdfjsVersion = packageJson.dependencies['pdfjs-dist'];

    return pdfjsVersion
}

export default useWorkerUrl