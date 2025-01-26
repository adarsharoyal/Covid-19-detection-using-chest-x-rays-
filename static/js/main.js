$(document).ready(function () {
    // Init
    $('.image-section').hide();
    $('.loader').hide();
    $('#result').hide();

    // Upload Preview
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imageUpload").change(function () {
        $('.image-section').show();
        $('#btn-predict').show();
        $('#result').text('');
        $('#result').hide();
        readURL(this);
    });

    // Predict
    $('#btn-predict').click(function () {
        var form_data = new FormData($('#upload-file')[0]);

        // Show loading animation
        $(this).hide();
        $('.loader').show();

        // Make prediction by calling api /predict
        $.ajax({
            type: 'POST',
            url: '/predict',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data) {
                // Get and display the result
                $('.loader').hide();
                $('#result').fadeIn(600);

                // Set styles dynamically based on prediction
                
                let resultHTML = `
    <div style="background-color: #39D2B4; padding: 1px; border-radius: 2px; margin-bottom: 10px;display: inline-block;">
        <span style="font-size: 28px; font-weight: bold; color: black;">Result:</span>
    </div>`;

                
            
                if (data === "COVID-19") {
                    resultHTML += `
                    <div style="background-color: white; padding: 1px; border-radius: 2px;display: inline-block;">
                        <span style="font-size: 20px; font-weight: bold; color: black;"> The person is suffering from: </span>
                        
                        <span style="font-size: 30px; font-weight: bold; color: red;padding-left: 1px;">COVID-19</span>
                    </div>`;
                } else if (data === "Pneumonia") {
                    resultHTML += `
                    <div style="background-color: white; padding: 1px; border-radius: 2px;display: inline-block;">
                        <span style="font-size: 20px; font-weight: bold; color: black;"> The person is suffering from: </span>
                       
                        <span style="font-size: 30px; font-weight: bold; color: orange;padding-left: 1px;">Pneumonia</span>
                    </div>`;
                } else if (data === "NORMAL") {
                    resultHTML += `
                    <div style="background-color: white; padding: 0; border-radius: 2px; display: inline-block;">
                       
                         <span style="font-size: 20px; font-weight: bold; color: black;">The person is Healthy: </span>
                         <span style="font-size: 30px; font-weight: bold; color: green;">Normal</span>
                     </div>`;
   
                
                } else {
                    resultHTML += `
                        <span style="font-size: 20px; font-weight: bold; color: black;"> Unable to detect a valid condition. </span>`;
                }

                $('#result').html(resultHTML);
                console.log('Success!');
            },
        });
    });
});
