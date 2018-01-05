var stripe = Stripe('pk_test_hlZfwl93oEuhN7m21ywWtAyd');
var elements = stripe.elements();

function registerElements(elements, exampleName) {
    var formClass = '.' + exampleName;
    var example = document.querySelector(formClass);

    var form = example.querySelector('form');

    function enableInputs() {
        Array.prototype.forEach.call(
            form.querySelectorAll(
                "input[type='text'], input[type='email'], input[type='tel']"
            ),
            function (input) {
                input.removeAttribute('disabled');
            }
        );
    }
}

function disableInputs() {
    Array.prototype.forEach.call(
        form.querySelectorAll(
            "input[type='text'], input[type='email'], input[type='tel']"
        ),
        function (input) {
            input.setAttribute('disabled', 'true');
        }
    );
}

// Listen on the form's 'submit' handler...
form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Show a loading screen...
    example.classList.add('submitting');

    // Disable all inputs.
    disableInputs();

    // Gather additional customer data we may have collected in our form.
    var name = form.querySelector('#' + exampleName + '-name');
    var address1 = form.querySelector('#' + exampleName + '-address');
    var city = form.querySelector('#' + exampleName + '-city');
    var state = form.querySelector('#' + exampleName + '-state');
    var zip = form.querySelector('#' + exampleName + '-zip');
    var additionalData = {
        name: name ? name.value : undefined,
        address_line1: address1 ? address1.value : undefined,
        address_city: city ? city.value : undefined,
        address_state: state ? state.value : undefined,
        address_zip: zip ? zip.value : undefined,
    };

    // Use Stripe.js to create a token. We only need to pass in one Element
    // from the Element group in order to create a token. We can also pass
    // in the additional customer data we collected in our form.
    stripe.createToken(elements[0], additionalData).then(function (result) {
        // Stop loading!
        example.classList.remove('submitting');

        if (result.token) {
            // If we received a token, show the token ID.
            example.querySelector('.token').innerText = result.token.id;
            example.classList.add('submitted');
        } else {
            // Otherwise, un-disable inputs.
            enableInputs();
        }
    });
});


(function () {
    'use strict';

    var elements = stripe.elements({
        fonts: [{
            cssSrc: 'https://fonts.googleapis.com/css?family=Roboto',
        }, ],
        // Stripe's examples are localized to specific languages, but if
        // you wish to have Elements automatically detect your user's locale,
        // use `locale: 'auto'` instead.
        locale: window.__exampleLocale
    });

    var card = elements.create('card', {
        iconStyle: 'solid',
        style: {
            base: {
                iconColor: '#c4f0ff',
                color: '#fff',
                fontWeight: 500,
                fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                fontSize: '15px',
                fontSmoothing: 'antialiased',

                ':-webkit-autofill': {
                    color: '#fce883',
                },
                '::placeholder': {
                    color: '#87BBFD',
                },
            },
            invalid: {
                iconColor: '#FFC7EE',
                color: '#FFC7EE',
            },
        },
    });
    card.mount('#example1-card');

    registerElements([card], 'example1');
})();