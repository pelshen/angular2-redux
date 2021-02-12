import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from '../app/app.component';
import { createAppStoreFactory, createAppStoreFactoryWithOptions, applyDevTools } from '../app-store-factory';

const reducer = (state = 0, action) => {
    if (action.type === 'inc') {
        return state + 1;
    } else {
        return state;
    }
};

describe('createAppStoreFactoryWithOptions', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ]
        }).compileComponents();
    }));

    it('returns a function that creates an AppStore', () => {
        const f = createAppStoreFactory(reducer);
        const appStore = f();
        expect(typeof appStore === 'object');
        appStore.dispatch({ type: 'inc' });
        expect(appStore.getState() === 1);
    });

    it('Supports multiple reducers', () => {
        const f = createAppStoreFactoryWithOptions({ reducers: { a: reducer, b: reducer } });
        const appStore = f();
        appStore.dispatch({ type: 'inc' });
        expect(appStore.getState() === { a: 1, b: 1 });
    });

    it('Supports thunks', () => {
        const f = createAppStoreFactoryWithOptions({ reducers: reducer });
        const appStore = f();
        appStore.dispatch((dispatch) => {
            dispatch({ type: 'inc' });
            dispatch({ type: 'inc' });
        });
        expect(appStore.getState() === 2);
    });

    it('Supports additional middleware', () => {

        let counterInsideLogger = 0;
        const logger = store => next => action => {
            counterInsideLogger++;
            return next(action);
        };

        const f = createAppStoreFactoryWithOptions({
            reducers: reducer
        });
        const appStore = f();
        appStore.dispatch((dispatch) => {
            dispatch({ type: 'inc' });
            dispatch({ type: 'inc' });
        });
        expect(appStore.getState() === 2);
        expect(counterInsideLogger === 2);
    });

});
