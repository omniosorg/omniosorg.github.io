---
layout: page
title: Donate
order: 11
show_in_menu: true
show_in_sidebar: true
---

# Become a Patron of the OmniOS Community Edition

OmniOS Community Edition has no major company behind it, just a small team of
people who spend their precious spare time keeping it up-to-date. If you rely
on OmniOS for fun or business, and you want to help secure its future, you can
contribute by becoming an OmniOS patron.

We are committed to providing updates to OmniOS for many years to come and
to maintaining the stable and long-term-release models put in place by
OmniTI before us. Your donation will help us to achieve that goal and
ensure the long-term success of OmniOS.

We use the money provided by our patrons to pay for any services used in
publishing and maintaining OmniOS. The rest of the money gets divided up
and distributed among the core contributors according to the amount of time
they put into the project - with the OmniOSce Association directing fund
allocation.

If you set up a recurring subscription, please take care to enter your email
address correctly as we will alert you a few days before the next payment is
due, with the option to cancel your subscription.

Note, this has nothing todo with *Patreon* we are using *Stripe* as our card processing
service.

<form class="patron_form">
<div class="row">
<div class="input-field col s6 offset-m1 m5 offset-l2 l2 offset-xl3 xl2">
    <input placeholder="Amount" name="amount" id="amount_fld" type="text" class="validate">
    <label for="amount">Amount</label>
</div>
<div class="input-field col s6 m5 l3 xl2">
    <select id="currency_fld">
      <option default value="usd">US Dollars</option>
      <option value="gbp">GB Pounds</option>
      <option value="eur">Euros</option>
      <option value="chf">Swiss Francs</option>
    </select>
    <label>Currency</label>
</div><div class="input-field col s12 offset-m1 m10 l3 xl2">
    <select id="period_fld">
      <option value="week">Weekly</option>
      <option selected default value="month">Monthly</option>
      <option value="year">Yearly</option>
      <option value="once">One-Off</option>
    </select>
    <label>Period</label>
</div>
<div class="col s12 offset-m1 m10 offset-l2 l8 offset-xl3 xl6">
    <button style="width: 100%" id="start-stripe" class="btn waves-effect waves-light btn-large" type="submit" name="action"><i class="material-icons right">done</i>Become a Patron</button>
</div>
</div>
</form>
<div id="notice"></div>

<script src="https://checkout.stripe.com/checkout.js"></script>
<script>
(function(){
var handler = StripeCheckout.configure({
//  key: 'pk_test_UFESfp6M4UmMqz340REVYtCB',
    key: 'pk_live_WJeXh3PCWlVcm1aSxBpEIT5B',
  image: '/favicon-512.png',
  locale: 'auto',
  token: function(token,args) {
       jQuery('.patron_form').slideUp();
       jQuery('#notice').html("<h2>Processing your Request ... " +
           "<img src=/assets/images/spinner.gif></h2>");
       jQuery.ajax('https://apps.omniosce.org/patron/subscribe', {
       // jQuery.ajax('http://localhost:23843/patron/subscribe', {
	dataType: 'json',
	method: 'POST',
	contentType: 'application/json; charset=utf-8',
	data: JSON.stringify({
	    token: token,
	    args: args,
	    amount: Math.round(parseFloat(jQuery('#amount_fld').val())),
	    period: jQuery('#period_fld').val(),
	    currency: jQuery('#currency_fld').val()
	}),
	success: function(msg){
	    jQuery('#notice').html(
		'<h2><i class="material-icons">check</i> ' +
		'Thank you for your donation. We have sent a confirmation ' +
		'message to the email address provided.</h2>' +
		'<h3>Please contact ' +
		'<a href="mailto:patrons@omnios.org">patrons@omnios.org</a> ' +
		'if the message does not arrive within a few minutes.</h3>');
	},
	error: function(xhr,status){
	   jQuery('#notice').html('<h2><i class="material-icons">sms_failed</i> ' +
		'There was a problem processing your request. Please contact ' +
		'<a href="mailto:patrons@omnios.org">patrons@omnios.org</a>.</h2>');
	}
     });
  }
});

// not using jQuery here since it is not loaded at this point (jquery gets
// loaded at the bottom of html
document.getElementById('start-stripe').addEventListener('click', function(e) {
  e.preventDefault();
  var amount = parseFloat(jQuery('#amount_fld').val());
  if (isNaN(amount) || amount < 0) {
	jQuery('#notice').html('<h2>Please enter a valid amount above.</h2>');
	return false;
  }
  // Open Checkout with further options:
  handler.open({
    name: 'OmniOS Patron',
    description: jQuery('#period_fld').val() + ' Contribution',
    currency: jQuery('#currency_fld').val(),
    amount: Math.round(amount) * 100,
    allowRememberMe: true,
    billingAddress: true,
    panelLabel: 'Pay {{amount}} '+ jQuery('#period_fld').val()
  });
});

// Close Checkout on page navigation:
window.addEventListener('popstate', function() {
  handler.close();
});
})();</script>

You can also use traditional banking transactions to send us your
contributions by paying directly to our account here in Switzerland.

IBAN CH22 0900 0000 6188 9767 7<br/>
BIC POFICHBEXX<br/>
Verein OmniOS Community Edition

If you have questions regarding your subscription, or if you want to
discuss other options to support our work, please feel free to contact <a
href="mailto:patrons@omnios.org">patrons@omnios.org</a> at any time.

## How your payments are processed

Our donation system is using <a href="https://stripe.com">stripe.com</a> as a payment provider.
We do not keep ANY information locally. Credit card numbers are NOT available to us at any point
in the payment process. The integration of <a href="https://stripe.com">stripe.com</a> and all the user
interactions are handled by our <a href="https://github.com/omniosorg/ooceapps">OOceApps</a> package.
