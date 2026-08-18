import { RootStore } from '@tdev-stores/rootStore';
import { ToolsStore } from './ToolsStore';
import { ScavengerHuntStore } from './ScavengerHuntStore';
import { AttendanceCheckStore } from './AttendanceCheckStore';

export default class SiteStore {
    toolsStore: ToolsStore;
    scavengerHuntStore: ScavengerHuntStore;
    attendanceCheckStore: AttendanceCheckStore;

    constructor(root: RootStore) {
        this.toolsStore = new ToolsStore(root);
        this.scavengerHuntStore = new ScavengerHuntStore(root);
        this.attendanceCheckStore = new AttendanceCheckStore(root);
    }
}
