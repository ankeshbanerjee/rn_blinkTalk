import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

const handleDownloadAndView = (
  url: string,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  // const url =
  // // 'http://samples.leanpub.com/thereactnativebook-sample.pdf'
  // "https://scholar.harvard.edu/files/torman_personal/files/samplepptx.pptx";

  // *IMPORTANT*: The correct file extension is always required.
  // You might encounter issues if the file's extension isn't included
  // or if it doesn't match the mime type of the file.
  // https://stackoverflow.com/a/47767860
  function getUrlExtension(url: string): string {
    return url.split(/[#?]/)[0].split('.').pop()!.trim();
  }

  const extension = getUrlExtension(url);
  //   const extension = type === 'image' ? 'png' : 'text';
  console.log(extension);
  // Feel free to change main path according to your requirements.
  const localFile = `${
    RNFS.DownloadDirectoryPath
  }/${Date.now().toString()}.${extension}`;

  const options = {
    fromUrl: url,
    toFile: localFile,
  };

  setLoading && setLoading(true);
  RNFS.downloadFile(options)
    .promise.then(() =>
      FileViewer.open(localFile, {
        showAppsSuggestions: true, // redirects to play store, if no relevant app is installed to open the file
        // showOpenWithDialog: true,    // lists all the relevant apps installed in the device to open the file
      }),
    )
    .then(() => {
      // success
      console.log('file opened!');
      setLoading && setLoading(false);
    })
    .catch((error: unknown) => {
      // error
      console.log(error);
      setLoading && setLoading(false);
    });
};

export default handleDownloadAndView;
