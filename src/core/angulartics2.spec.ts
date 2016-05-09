import {Route, Router} from '@angular/router';
import {Location} from '@angular/common';
import {
  it,
  inject,
  describe,
  expect,
  beforeEach,
  beforeEachProviders,
  fakeAsync
} from '@angular/core/testing';
import {
  TestComponentBuilder,
  ComponentFixture
} from '@angular/compiler/testing';

import {TEST_ROUTER_PROVIDERS, RootCmp, advance, compile} from '../test.mocks';
import {Angulartics2} from './angulartics2';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

export function main() {
  describe('angulartics2', () => {

    var fixture: ComponentFixture<any>;

    it('is defined', () => {
      expect(Angulartics2).toBeDefined();
    });

    describe('initialize', function() {

      beforeEachProviders(() => [
        TEST_ROUTER_PROVIDERS,
        Angulartics2
      ]);

      it('should track pages by default',
        inject([Angulartics2],
          (angulartics2: Angulartics2) => {
            expect(angulartics2.settings.pageTracking.autoTrackVirtualPages).toBe(true);
      }));
    });

    describe('Configuration', function() {
      var EventSpy: any;

      beforeEachProviders(() => [
        TEST_ROUTER_PROVIDERS,
        Angulartics2
      ]);

      beforeEach(function() {
        EventSpy = jasmine.createSpy('EventSpy');
      });

      it('should configure virtualPageviews',
        inject([Angulartics2],
          (angulartics2: Angulartics2) => {
            angulartics2.virtualPageviews(false);
            expect(angulartics2.settings.pageTracking.autoTrackVirtualPages).toBe(false);
      }));

      it('should configure excluded routes',
        inject([Angulartics2],
          (angulartics2: Angulartics2) => {
            angulartics2.excludeRoutes(['/abc/def']);
            expect(angulartics2.settings.pageTracking.excludedRoutes).toEqual(['/abc/def']);
      }));

      it('should configure developer mode',
        inject([TestComponentBuilder, Router, Angulartics2],
          (tcb: TestComponentBuilder, router: Router, angulartics2: Angulartics2) => {
            compile(tcb)
              .then((rtc) => fixture = rtc)
              .then((_) => angulartics2.developerMode(true))
              .then((_) => angulartics2.pageTrack.subscribe((x: any) => EventSpy(x)))
              .then((_) => router.navigateByUrl('/abc'))
              .then((_) => {
                fixture.detectChanges();
                return new Promise((resolve) => {
                  setTimeout(() => {
                    expect(EventSpy).toHaveBeenCalled();
                    resolve();
                  });
                });
              });
          }));

    });

    describe('router support', function() {
      var EventSpy: any;

      beforeEachProviders(() => [
        TEST_ROUTER_PROVIDERS,
        Angulartics2
      ]);

      beforeEach(function() {
        EventSpy = jasmine.createSpy('EventSpy');
      });

      it('should track pages on route change',
        inject([TestComponentBuilder, Router, Location, Angulartics2],
          (tcb: TestComponentBuilder, router: Router, location: Location, angulartics2: Angulartics2) => {
            compile(tcb)
              .then((rtc) => fixture = rtc)
              .then((_) => {
                angulartics2.pageTrack.subscribe((x: any) => EventSpy(x));
                return router.navigateByUrl('/abc');
              })
              .then((_) => {
                fixture.detectChanges();
                return new Promise((resolve) => {
                  setTimeout(() => {
                    expect(EventSpy).toHaveBeenCalledWith({ path: '/abc', location: location });
                    resolve();
                  });
                });
              });
          }));
    });

    describe('excludedRoutes', function() {
      var EventSpy: any;

      beforeEachProviders(() => [
        TEST_ROUTER_PROVIDERS,
        Angulartics2
      ]);

      beforeEach(function() {
        EventSpy = jasmine.createSpy('EventSpy');
      });

      it('should have empty excludedRoutes by default',
        inject([Angulartics2], (angulartics2: Angulartics2) => {
          expect(angulartics2.settings.pageTracking.excludedRoutes.length).toBe(0);
        }));

      it('should trigger page track if excludeRoutes is empty',
        inject([TestComponentBuilder, Router, Location, Angulartics2],
          (tcb: TestComponentBuilder, router: Router, location: Location, angulartics2: Angulartics2) => {
            compile(tcb)
              .then((rtc) => fixture = rtc)
              .then((_) => {
                angulartics2.pageTrack.subscribe((x: any) => EventSpy(x));
                angulartics2.settings.pageTracking.excludedRoutes = [];
                return router.navigateByUrl('/abc');
              })
              .then((_) => {
                fixture.detectChanges();
                return new Promise((resolve) => {
                  setTimeout(() => {
                    expect(EventSpy).toHaveBeenCalledWith({ path: '/abc', location: location });
                    resolve();
                  });
                });
              });
          }));

      it('should trigger page track if excludeRoutes do not match current route',
        inject([TestComponentBuilder, Router, Location, Angulartics2],
          (tcb: TestComponentBuilder, router: Router, location: Location, angulartics2: Angulartics2) => {
            compile(tcb)
              .then((rtc) => fixture = rtc)
              .then((_) => {
                angulartics2.pageTrack.subscribe((x: any) => EventSpy(x));
                angulartics2.settings.pageTracking.excludedRoutes = ['/def'];
                return router.navigateByUrl('/abc');
              })
              .then((_) => {
                fixture.detectChanges();
                return new Promise((resolve) => {
                  setTimeout(() => {
                    expect(EventSpy).toHaveBeenCalledWith({ path: '/abc', location: location });
                    resolve();
                  });
                });
              });
          }));

      it('should not trigger page track if current route is excluded',
        inject([TestComponentBuilder, Router, Location, Angulartics2],
          (tcb: TestComponentBuilder, router: Router, location: Location, angulartics2: Angulartics2) => {
            compile(tcb)
              .then((rtc) => fixture = rtc)
              .then((_) => {
                angulartics2.pageTrack.subscribe((x: any) => EventSpy(x));
                angulartics2.settings.pageTracking.excludedRoutes = ['/abc'];
                return router.navigateByUrl('/abc');
              })
              .then((_) => {
                fixture.detectChanges();
                return new Promise((resolve) => {
                  setTimeout(() => {
                    expect(EventSpy).not.toHaveBeenCalledWith({ path: '/abc', location: location });
                    resolve();
                  });
                });
              });
          }));

      it('should not allow for multiple route exclusions to be specified',
        inject([TestComponentBuilder, Router, Location, Angulartics2],
          (tcb: TestComponentBuilder, router: Router, location: Location, angulartics2: Angulartics2) => {
            compile(tcb)
              .then((rtc) => fixture = rtc)
              .then((_) => {
                angulartics2.pageTrack.subscribe((x: any) => EventSpy(x));
                // Ignore excluded route
                angulartics2.settings.pageTracking.excludedRoutes = ['/def', '/abc'];
                return router.navigateByUrl('/abc');
              })
              .then((_) => {
                fixture.detectChanges();
                return new Promise((resolve) => {
                  setTimeout(() => {
                    expect(EventSpy).not.toHaveBeenCalledWith({ path: '/abc', location: location });
                    resolve();
                  });
                });
              })
              .then((_) => router.navigateByUrl('/def'))
              .then((_) => {
                // Ignore excluded route
                fixture.detectChanges();
                return new Promise((resolve) => {
                  setTimeout(() => {
                    expect(EventSpy).not.toHaveBeenCalledWith({ path: '/def', location: location });
                    resolve();
                  });
                });
              })
              .then((_) => router.navigateByUrl('/ghi'))
              .then((_) => {
                // Track non-excluded route
                fixture.detectChanges();
                return new Promise((resolve) => {
                  setTimeout(() => {
                    expect(EventSpy).toHaveBeenCalledWith({ path: '/ghi', location: location });
                    resolve();
                  });
                });
              });
          }));

      it('should allow specifying excluded routes as regular expressions',
        inject([TestComponentBuilder, Router, Location, Angulartics2],
          (tcb: TestComponentBuilder, router: Router, location: Location, angulartics2: Angulartics2) => {
            compile(tcb)
              .then((rtc) => fixture = rtc)
              .then((_) => {
                angulartics2.pageTrack.subscribe((x: any) => EventSpy(x));
                angulartics2.settings.pageTracking.excludedRoutes = [/\/sections\/\d+\/pages\/\d+/];
                return router.navigateByUrl('/sections/123/pages/456');
              })
              .then((_) => {
                fixture.detectChanges();
                return new Promise((resolve) => {
                  setTimeout(() => {
                    expect(EventSpy).not.toHaveBeenCalledWith({ path: '/sections/123/pages/456', location: location });
                    resolve();
                  });
                });
              });
          }));

    });

    describe('EventEmiters', function() {
      var EventSpy: any;

      var EventEmiters: Array<string> = [
        'pageTrack',
        'eventTrack',
        'exceptionTrack',
        'setUsername',
        'setUserProperties',
        'setUserPropertiesOnce',
        'setSuperProperties',
        'setSuperPropertiesOnce',
        'userTimings'
      ];

      beforeEachProviders(() => [
        TEST_ROUTER_PROVIDERS,
        Angulartics2
      ]);

      beforeEach(function() {
        EventSpy = jasmine.createSpy('EventSpy');
      });


      it('should subscribe to and emit from ' + event,
        inject([TestComponentBuilder, Angulartics2],
          (tcb: TestComponentBuilder, angulartics2: Angulartics2) => {
            return compile(tcb)
              .then((rtc) => fixture = rtc)
              .then((_) => {
                fixture.detectChanges();
                for (var event of EventEmiters) {
                  (<any>angulartics2)[event].subscribe((x: any) => EventSpy(x));
                  (<any>angulartics2)[event].next(`test: ${event}`);
                  expect(EventSpy).toHaveBeenCalledWith(`test: ${event}`);
                }
              });
          }));

    });

  });
}
