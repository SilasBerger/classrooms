import { RootStore } from '@tdev-stores/rootStore';
import { action, observable } from 'mobx';
import { computedFn } from 'mobx-utils';

export class AttendanceCheckStore {
    seenIds = observable.set<string>([]);

    constructor(private root: RootStore) {}

    @action
    markAsSeen(id: string) {
        this.seenIds.add(id);
    }

    wasSeen = computedFn((id: string) => {
        return this.seenIds.has(id);
    });
}
