---
layout: page
title: Become a Patron of OmniOSce
show_in_menu: false
---

# Become a Patron of OmniOS Community Edition

OmniOS Community Edition has no major company behind it, but a bunch of
people who spend their precious spare time keeping it up to date.  If you
are relying on OmniOS for fun or business, and you want to help secure its
future, you can either join us and start contributing your time, or you can
become an OmniOS Patron.

We use the money provided by our patrons to pay for any services we use in
publishing and maintaining OmniOS. The rest of the money gets divided up
and distributed among the core contributors according to the amount of time
they put into the project. Ultimately the board of the OmniOSce Association
decides about the use of the money.


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
      <option default value="Monthly">Monthly</option>
      <option value="OneTime">One Time</option>
      <option value="Weekly">Weekly</option>
      <option value="Yearly">Yearly</option>
    </select>
    <label>Period</label>
</div>
<div class="col s12 offset-m1 m10 offset-l2 l8 offset-xl3 xl6">
    <button style="width: 100%" id="start-stripe" class="btn waves-effect waves-light btn-large" type="submit" name="action"><i class="material-icons right">done</i>Become a Patron</button>
</div>
</div>
</form>

<script src="https://checkout.stripe.com/checkout.js"></script>
<script>
(function(){
var handler = StripeCheckout.configure({
  key: 'pk_test_UFESfp6M4UmMqz340REVYtCB',
  image: '/favicon-512.png',
  locale: 'auto',
  token: function(token) {
      jQuery.ajax('https://apps.omniosce.org/patron', {
	dataType: 'json',
	method: 'POST',
	contentType: 'application/json; corset=utf-8',
	data: JSON.strigify({
	    token: token,
	    amount: jQuery('#amount_fld').val(),
	    period: jQuery('#period_fld').val()
	    currency: jQuery('#currency_fld').val()
	}),
	succsss: function(msg){
	    console.log('yey success')
	},
	error: function(xhr,status){
	    console.log('problem' + status)
	}
     });
  }
});

document.getElementById('start-stripe').addEventListener('click', function(e) {
  // Open Checkout with further options:
  handler.open({
    name: 'OmniOS Patron',
    description: $('#period').val() + ' Contribution',
    currency: $('#currency').val(),
    amount: parseFloat($('#amount').val()) * 100,
    allowRememberMe: true,
    billingAddress: true,
    panelLabel: 'Pay {{amount}} '+ $('#period').val()
  });
  e.preventDefault();
});

// Close Checkout on page navigation:
window.addEventListener('popstate', function() {
  handler.close();
});
})();</script>

WORK IN PROGRESS!

