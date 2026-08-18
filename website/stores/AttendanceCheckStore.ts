import { RootStore } from '@tdev-stores/rootStore';
import { action, computed, observable, observableRef } from 'mobx';
import { computedFn } from 'mobx-utils';

export class AttendanceCheckStore {
    @observable accessor startTime: number | undefined = undefined;
    @observableRef accessor studentTimings = observable.map<
        string,
        { seenAfterSeconds: number | undefined }
    >();

    constructor(private root: RootStore) {}

    @action
    markAsSeen(id: string) {
        if (this.timerRunning) {
            if (!this.getComeOnlineTime(id)) {
                const secondsSinceStart = (Date.now() - (this.startTime ?? 0)) / 1000;
                this.studentTimings.set(id, { seenAfterSeconds: secondsSinceStart });
            }
        } else {
            this.studentTimings.set(id, { seenAfterSeconds: undefined });
        }
    }

    @action
    startTimer() {
        this.startTime = Date.now();
    }

    @action
    stopTimer() {
        this.startTime = undefined;
    }

    @computed
    get timerRunning() {
        return this.startTime !== undefined;
    }

    @action
    toggleTimer() {
        if (this.timerRunning) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
    }

    @action
    reset(): void {
        this.startTime = undefined;
        this.studentTimings.clear();
    }

    wasSeen = computedFn((id: string) => {
        return this.studentTimings.has(id);
    });

    getComeOnlineTime = computedFn((id: string) => {
        const timing = this.studentTimings.get(id);
        return timing?.seenAfterSeconds;
    });
}
