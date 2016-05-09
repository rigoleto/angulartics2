import {Router, Route} from '@angular/router';
import {
  async,
  it,
  inject,
  describe,
  expect,
  beforeEach,
  beforeEachProviders
} from '@angular/core/testing';
import {
  TestComponentBuilder,
  ComponentFixture
} from '@angular/compiler/testing';

import {TEST_ROUTER_PROVIDERS, RootCmp, compile} from '../test.mocks';
import {Angulartics2} from '../core/angulartics2';
import {Angulartics2GoogleAnalytics} from './angulartics2-google-analytics';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

export function main() {


  describe('Angulartics2GoogleAnalytics', () => {
    var ga: any;
    var _gaq: Array<any>;
    var fixture: ComponentFixture<any>;

    beforeEachProviders(() => [
      TEST_ROUTER_PROVIDERS,
      Angulartics2,
      Angulartics2GoogleAnalytics
    ]);

    beforeEach(function() {
      window.ga = ga = jasmine.createSpy('ga');
      window._gaq = _gaq = [];
    });

    it('should track initial page',
      async(inject([TestComponentBuilder, Router, Angulartics2, Angulartics2GoogleAnalytics],
        (tcb: TestComponentBuilder, router: Router, angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) => {
          compile(tcb)
            .then((rtc) => fixture = rtc)
            .then((_) => {
              fixture.detectChanges();
              return new Promise((resolve) => {
                setTimeout(() => {
                  expect(_gaq).toContain(['_trackPageview', '']);
                  expect(ga).toHaveBeenCalledWith('send', 'pageview', '');
                  resolve();
                });
              });
            });
        })));

    it('should track pages',
      async(inject([TestComponentBuilder, Router, Angulartics2, Angulartics2GoogleAnalytics],
        (tcb: TestComponentBuilder, router: Router, angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) => {
          compile(tcb)
            .then((rtc) => fixture = rtc)
            .then((_) => router.navigateByUrl('/abc'))
            .then((_) => {
              fixture.detectChanges();
              return new Promise((resolve) => {
                setTimeout(() => {
                  expect(ga).toHaveBeenCalledWith('send', 'pageview', '/abc');
                  resolve();
                });
              });
            });
        })));

    it('should track events',
      async(inject([TestComponentBuilder, Angulartics2, Angulartics2GoogleAnalytics],
        (tcb: TestComponentBuilder, angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) => {
          compile(tcb)
            .then((rtc) => fixture = rtc)
            .then((_) => angulartics2.eventTrack.next({ action: 'do', properties: { category: 'cat' } }))
            .then((_) => {
              fixture.detectChanges();
              return new Promise((resolve) => {
              //   setTimeout(() => {
                  expect(ga).toHaveBeenCalledWith('send', 'event', { eventCategory: 'cat', eventAction: 'do', eventLabel: undefined, eventValue: undefined, nonInteraction: undefined, page: '/context.html', userId: null });
                  resolve();
              //   });
              });
            });
        })));

    it('should track exceptions',
      async(inject([TestComponentBuilder, Angulartics2, Angulartics2GoogleAnalytics],
        ((tcb: TestComponentBuilder, angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) => {
          compile(tcb)
            .then((rtc) => fixture = rtc)
            .then((_) => angulartics2.exceptionTrack.next({ appId: 'app', appName: 'Test App', appVersion: '0.1' }))
            .then((_) => {
              fixture.detectChanges();
              return new Promise((resolve) => {
              //   setTimeout(() => {
                  expect(ga).toHaveBeenCalledWith('send', 'exception', { appId: 'app', appName: 'Test App', appVersion: '0.1', exFatal: true, exDescription: undefined });
                  resolve();
              //   });
              });
            });
        }))));

    it('should set username',
      async(inject([TestComponentBuilder, Angulartics2, Angulartics2GoogleAnalytics],
        (tcb: TestComponentBuilder, angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) => {
          compile(tcb)
            .then((rtc) => fixture = rtc)
            .then((_) => angulartics2.setUsername.next('testuser'))
            .then((_) => {
              fixture.detectChanges();
              return new Promise((resolve) => {
                setTimeout(() => {
                  expect(angulartics2.settings.ga.userId).toBe('testuser');
                  resolve();
                });
              });
            });
        })));

    it('should set user porperties',
      async(inject([TestComponentBuilder, Angulartics2, Angulartics2GoogleAnalytics],
        (tcb: TestComponentBuilder, angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) => {
          compile(tcb)
            .then((rtc) => fixture = rtc)
            .then((_) => angulartics2.setUserProperties.next({ dimension1: 'test' }))
            .then((_) => {
              fixture.detectChanges();
              return new Promise((resolve) => {
                // setTimeout(() => {
                  expect(ga).toHaveBeenCalledWith('set', 'dimension1', 'test');
                  resolve();
                // });
              });
            })
            .then((_) => angulartics2.setUserProperties.next({ metric1: 'test' }))
            .then((_) => {
              fixture.detectChanges();
              return new Promise((resolve) => {
              //   setTimeout(() => {
                  expect(ga).toHaveBeenCalledWith('set', 'metric1', 'test');
                  resolve();
              //   });
              });
            });
        })));

    it('should track user timings',
      async(inject([TestComponentBuilder, Angulartics2, Angulartics2GoogleAnalytics],
        (tcb: TestComponentBuilder, angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) => {
          compile(tcb)
            .then((rtc) => fixture = rtc)
            .then((_) => angulartics2.userTimings.next({ timingCategory: 'cat', timingVar: 'var', timingValue: 100 }))
            .then((_) => {
              fixture.detectChanges();
              return new Promise((resolve) => {
                // setTimeout(() => {
                  expect(ga).toHaveBeenCalledWith('send', 'timing', { timingCategory: 'cat', timingVar: 'var', timingValue: 100 });
                  resolve();
                // });
              });
            });
        })));

  });
}
