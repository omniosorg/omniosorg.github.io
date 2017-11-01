---
layout: page
title: Become a Patron of OmniOSce
show_in_menu: false
---

# Become a Patron of OmniOS Community Edition

<img src="/support.png" class="fleft" alt="Support Us">

OmniOS Community Edition has no major company behind it, just a small team of
people who spend their precious spare time keeping it up-to-date. If you
are relying on OmniOS for fun or business, and you want to help secure its
future, you can either join us and start contributing your time, or you can
become an OmniOS Patron.

We use the money provided by our patrons to pay for any services we use in
publishing and maintaining OmniOS. The rest of the money gets divided up
and distributed among the core contributors according to the amount of time
they put into the project. Ultimately the board of the OmniOSce Association
decides about the use of funds.


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
      <option default value="month">Monthly</option>
      <option value="once">One Time</option>
      <option value="week">Weekly</option>
      <option value="year">Yearly</option>
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
  key: 'pk_test_UFESfp6M4UmMqz340REVYtCB',
  image: '/favicon-512.png',
  locale: 'auto',
  token: function(token,args) {
       jQuery('.patron_form').slideUp();
       jQuery('#notice').html("<h1>Processing your Request ... " +
           "<img src=/spinner.gif></h1>");
       jQuery.ajax('https://apps.omniosce.org/patron/subscribe', {
       // jQuery.ajax('http://localhost:23843/patron/subscribe', {
	dataType: 'json',
	method: 'POST',
	contentType: 'application/json; corset=utf-8',
	data: JSON.stringify({
	    token: token,
	    args: args,
	    amount: Math.round(parseFloat(jQuery('#amount_fld').val())),
	    period: jQuery('#period_fld').val(),
	    currency: jQuery('#currency_fld').val()
	}),
	success: function(msg){
	    jQuery('#notice').html(
		'<img src=/thanks.png class="cfleft">' +
		'<h1 class="fleft">Thank you for your patronage. ' +
		'We have sent a confirmation message to the email address ' +
		'provided. Please contact patronage@omniosce.org if the mail ' +
		'does not arrive within 24h.</h1>');
	},
	error: function(xhr,status){
	   jQuery('#notice').html('<h1>There was a problem processing your request. Please contact patronage@omniosce.org.</h1>');
	}
     });
  }
});

// not using jQuery here since it is not loaded at this point (jquery gets
// loaded at the bottom of html
document.getElementById('start-stripe').addEventListener('click', function(e) {
  // Open Checkout with further options:
  handler.open({
    name: 'OmniOS Patron',
    description: jQuery('#period_fld').val() + ' Contribution',
    currency: jQuery('#currency_fld').val(),
    amount: Math.round(parseFloat(jQuery('#amount_fld').val())) * 100,
    allowRememberMe: true,
    billingAddress: true,
    panelLabel: 'Pay {{amount}} '+ jQuery('#period_fld').val()
  });
  e.preventDefault();
});

// Close Checkout on page navigation:
window.addEventListener('popstate', function() {
  handler.close();
});
})();</script>

WORK IN PROGRESS!

