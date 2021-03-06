'use strict';

const fb = require('./formbuilder.po').formbuilder;

const util = require('./test-util');

const hapiMock = require('./backend-mock');

describe('FHIR server interactions - ', function () {

  beforeAll(function () {
    util.loadHomePageIfNotLoaded();
  });

  describe('Add user specified FHIR server', function () {

    var testFhirUrl = 'https://lforms-fhir.nlm.nih.gov/baseR4';
    beforeEach(function () {
      hapiMock.run(browser, testFhirUrl);
    });

    it('should recognize user entered FHIR server', function () {
      fb.exportMenu.click();
      fb.createFhir.click();
      fb.addFhirServer.click();
      expect(fb.verifyBaseURL.isEnabled()).toBeFalsy();
      expect(fb.addToList.isEnabled()).toBeFalsy();
      fb.fhirServerUrlInput.sendKeys('http://localhost');
      expect(fb.verifyBaseURL.isEnabled()).toBeTruthy();
      expect(fb.addToList.isEnabled()).toBeFalsy();

      fb.verifyBaseURL.click();
      expect(fb.dialog.element(by.css('p.error-message')).getText()).toBe('Failed to recognize your FHIR server');
      fb.fhirServerUrlInput.clear();
      fb.fhirServerUrlInput.sendKeys(testFhirUrl);
      fb.verifyBaseURL.click();
      expect(fb.dialog.element(by.css('p.error-message')).getText()).toBe('');
      expect(fb.dialog.element(by.css('p.validate-message')).getText()).toBe(testFhirUrl + ' is recognized FHIR server.');
      expect(fb.verifyBaseURL.isEnabled()).toBeTruthy();
      expect(fb.addToList.isEnabled()).toBeTruthy();
      fb.closeDialog();
      fb.closeDialog();
    });
  });

  describe('FHIR resource operations on the server', function () {
    // Note - The tests in this block are in an order. Any changes to
    // a test suite could impact the following assertions.

    const newTitle = 'Newly created form';
    const updatedTitle = 'Updated form';
    const uhnServerName = 'http://hapi.fhir.org/baseR4';

    beforeAll(function () {
      util.resetForm();
      fb.formNode.click();
      fb.basicFormEditTab.click();
      fb.searchAndAddLoincPanel('vital signs pnl', 1);
    });

    afterEach(function () {
      fb.formNode.click();
      fb.basicFormEditTab.click();
    });

    it('should create', function () {
      fb.exportMenu.click();
      expect(fb.updateFhir.isEnabled()).toBeFalsy();
      fb.dismissMenu();
      util.assertCreateFhirResource(newTitle, uhnServerName);
      fb.exportMenu.click();
      expect(fb.updateFhir.isEnabled()).toBeTruthy();
      fb.dismissMenu();
    });

    it('should read', function () {
      util.assertImportFromFhir(newTitle);
    });

    // Assume there is a loaded panel
    it('should update', function () {
      fb.formNode.click();
      fb.formTitle.clear();
      fb.formTitle.sendKeys(updatedTitle);
      fb.exportMenu.click();
      fb.updateFhir.click();
      expect(fb.fhirResponse.isDisplayed()).toBeTruthy();
      fb.fhirResponse.getText().then(function(text){
        expect(text).toBe('\"Successfully updated the resource.\"');
      });

      fb.closeDialog();

      util.assertImportFromFhir(updatedTitle);
    });

    it('should do next/previous page', function () {

      fb.importMenu.click();
      fb.showFhirResources.click();
      fb.continueButton.click();
      expect(fb.dialog.isDisplayed()).toBeTruthy();
      fb.fhirServerPulldownSelect(uhnServerName).click();

      expect(fb.nextButton.isEnabled()).toBeTruthy();
      expect(fb.prevButton.isEnabled()).toBeFalsy();
      // First bundle is without total field, next three are with it.
      const eleForAbsentTotalField = element(by.cssContainingText('md-dialog div h4',
          'The following resources were found.'));
      expect(eleForAbsentTotalField.isDisplayed()).toBeTruthy();
      fb.nextButton.click();
      expect(fb.nextButton.isEnabled()).toBeTruthy();
      expect(fb.prevButton.isEnabled()).toBeTruthy();
      // This bundle is with total field.
      const eleForTotalField = element(by.cssContainingText('md-dialog div h4',
          '20 resources were found.'));
      expect(eleForTotalField.isDisplayed()).toBeTruthy();
      fb.nextButton.click();
      expect(fb.nextButton.isEnabled()).toBeTruthy();
      expect(fb.prevButton.isEnabled()).toBeTruthy();
      fb.nextButton.click();
      expect(fb.nextButton.isEnabled()).toBeFalsy();
      expect(fb.prevButton.isEnabled()).toBeTruthy();

      fb.prevButton.click();
      expect(fb.nextButton.isEnabled()).toBeTruthy();
      expect(fb.prevButton.isEnabled()).toBeTruthy();
      fb.prevButton.click();
      expect(fb.nextButton.isEnabled()).toBeTruthy();
      expect(fb.prevButton.isEnabled()).toBeTruthy();
      fb.prevButton.click();
      expect(fb.nextButton.isEnabled()).toBeTruthy();
      expect(fb.prevButton.isEnabled()).toBeFalsy();

      fb.fhirServerPulldownSelect('http://hapi.fhir.org/baseDstu3').click();

      expect(fb.nextButton.isEnabled()).toBeTruthy();
      expect(fb.prevButton.isEnabled()).toBeFalsy();
      fb.nextButton.click();
      expect(fb.nextButton.isEnabled()).toBeTruthy();
      expect(fb.prevButton.isEnabled()).toBeTruthy();
      fb.nextButton.click();
      expect(fb.nextButton.isEnabled()).toBeTruthy();
      expect(fb.prevButton.isEnabled()).toBeTruthy();
      fb.nextButton.click();
      expect(fb.nextButton.isEnabled()).toBeFalsy();
      expect(fb.prevButton.isEnabled()).toBeTruthy();

      fb.prevButton.click();
      expect(fb.nextButton.isEnabled()).toBeTruthy();
      expect(fb.prevButton.isEnabled()).toBeTruthy();
      fb.prevButton.click();
      expect(fb.nextButton.isEnabled()).toBeTruthy();
      expect(fb.prevButton.isEnabled()).toBeTruthy();
      fb.prevButton.click();
      expect(fb.nextButton.isEnabled()).toBeTruthy();
      expect(fb.prevButton.isEnabled()).toBeFalsy();


      fb.closeDialog(); // fhir results
    });
  });

});

