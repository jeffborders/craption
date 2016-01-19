var $ = require('jquery');

function HomePage() {
	return {
		init: function() {
			this.$contactForm = $('#contact-form');
			this.addFormEvents();
			this.addBackToTopListener();
		},
		addBackToTopListener: function() {
			var self = this,
				$bttLink = $('#back-to-top');

			$bttLink.on('click', function(evt) {
				if (evt) evt.preventDefault();
				self.scrollToTop();
			});
		},
		scrollToTop: function() {
			var scrollToTarget = 0,
				$body = $('html, body');

			$body.animate({
				scrollTop: scrollToTarget
			}, 750);
		},
		addFormEvents: function() {
			var self = this,
				$feedback = $('#form-feedback'),
				form,
				formInputs;

			this.$contactForm.submit(function(evt) {
				if (evt) evt.preventDefault();

				formInputs = self.getFormInputs();
				form = self.validateForm(formInputs);

				if (form.invalid.length) {
					self.formFailed($feedback, "Please fill in all required fields before submitting the form!");
				} else {
					self.sendValidForm(formInputs);
				}

				return false;
			});
		},
		validateForm: function(inputs) {
			var i = 0,
				validInputs = [],
				invalidInputs = [];
			
			for (; i < inputs.length; i++) {
				var $inputEl = inputs[i]['el'],
					inputVal = inputs[i]['val'],
					inputType = inputs[i]['type'];
					

				if (this.fieldIsValid(inputVal, inputType)) {
					validInputs.push($inputEl);
				} else {
					invalidInputs.push($inputEl);
				}
			}

			return {
				"valid": validInputs,
				"invalid": invalidInputs
			}
		},
		fieldIsValid: function(field, type) {
			// check if type is email
			if (type === 'email') return this.emailIsValid(field);

			// otherwise
			if (
				!!field &&
				field !== -1 &&
				((typeof field === 'string' ) ? !!field.trim() : true) &&
				((Array.isArray(field)) ? field.length !== 0 : true)
			) {
				return true;
			} 

			return false;		
		},
		emailIsValid: function(email) {
			var regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
			return regex.test(email);
		},
		sendValidForm: function(form) {
			var self = this,
				$feedback = $("#form-feedback");

			$.ajax({
				url: '/contact',
				method: 'POST',
				data: { 
					"name" : form[0].val,
					"email" : form[1].val,
					"subject" : form[2].val,
					"message" : form[3].val
				}
 			}).done(function(resp) {
				if (!resp) {
					self.formFailed($feedback, "Sorry, something went wrong submitting the form. Please try again.");
					return;
				}

				self.formSuccessful($feedback, "Thank you for your note! We'll be in touch as soon as possible.");
			});
		},
		formSuccessful: function($feedback, message) {
			$feedback
				.addClass('success')
				.text(message);
		},
		formFailed: function($feedback, message) {
			$feedback
				.addClass('error')
				.text(message);
		},
		getFormInputs: function() {
			return [
				{
					el: this.$contactForm.find('[name=contact-name]'),
					val: this.$contactForm.find('[name=contact-name]').val(),
					type: 'text'
				},
				{
					el: this.$contactForm.find('[name=contact-email]'),
					val: this.$contactForm.find('[name=contact-email]').val(),
					type: 'email'
				},
				{
					el: this.$contactForm.find('[name=contact-subject]'),
					val: this.$contactForm.find('[name=contact-subject]').val(),
					type: 'text'
				},
				{
					el: this.$contactForm.find('[name=contact-message]'),
					val: this.$contactForm.find('[name=contact-message]').val(),
					type: 'text'
				}
			];
		}
	};
}

// on jquery dom ready, start app
$(function() {
	var homepage;
	
	homepage = new HomePage();
	homepage.init();
});