import {AppComponent} from './app.component';

import {async, TestBed} from '@angular/core/testing';

import {By} from '@angular/platform-browser';
// import { getDOM } from '@angular/platform-browser/src/dom/dom_adapter';

describe('Smoke test', () => {
    it('should run a passing test', () => {

        expect(true).toEqual(true, 'should pass');

    });
});

describe('AppComponent with TCB', function () {

    beforeEach(() => {
        async(() => {
            TestBed.compileComponents()
                .then(() => {
                    TestBed.configureTestingModule({ declarations: [AppComponent] });
                });
        });
    });



    it('should instantiate component', () => {

        async(() => {
            TestBed.compileComponents()
                .then(() => {
                    let fixture = TestBed.createComponent(AppComponent);
                    expect(fixture.componentInstance instanceof AppComponent).toBe(true, 'should create AppComponent');
                });
        });

    });

    it('should have expected <a class="navbar-brand"> text', () => {

        async(() => {
            TestBed.compileComponents()
                .then(() => {
                    let fixture = TestBed.createComponent(AppComponent);
                    //let appDOME1 = fixture.debugElement.children[0].nativeElement;

                    fixture.detectChanges();

                    // let h1 = fixture.debugElement.query(el => el.name === 'h1').nativeElement;  // it works
                    let h1 = fixture.debugElement.query(By.css('.navbar-brand')).nativeElement;            // preferred

                    expect(h1.innerText).toMatch(/Azure AD/i, '<a class="navbar-brand"> should say something about "Azure AD"');

                });
        });

    });

});

