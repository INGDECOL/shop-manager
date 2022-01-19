
        const convertFont = (fileInputId) => {
            var fileInput = document.getElementById(fileInputId);

            var reader = new FileReader();
            reader.readAsDataURL(fileInput.files[0]);

            reader.onload = function () {
                console.log(reader.result);//base64encoded string
                
            }
            reader.onerror = function (error) {
                console.log('Error: ', error);
            }

        }
        const fontConverter = () => {
            return { convertFont }
        }

export default fontConverter
