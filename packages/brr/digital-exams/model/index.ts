import { Document as DocumentProps, Factory, TypeDataMapping } from '@tdev-api/document';
import { Source } from '@tdev-models/iDocument';
import { TeacherAssessableData } from '..';
import iAssessable from '@tdev-models/documents/Assessable/iAssessable';
import { mdiSchool } from '@mdi/js';
import { observable } from 'mobx';
import DocumentStore from '@tdev-stores/DocumentStore';

export const createModel: Factory = (data, store) => {
    return new TeacherAssessable(data as DocumentProps<'teacher_assessable'>, store);
};

class TeacherAssessable
    extends iAssessable<'teacher_assessable'>
    implements iAssessable<'teacher_assessable'>
{
    @observable accessor points: number | null = null;

    constructor(props: DocumentProps<'teacher_assessable'>, store: DocumentStore) {
        // TODO: Is this the right store?
        super(props, store);
        this.points = props.data.points ?? null;
    }

    get icon(): string {
        // TODO: Allow customization through props.
        return mdiSchool;
    }

    reset(): void {
        // TODO: Consider propagating to context-aware children.
    }

    get isNA(): boolean {
        // TODO: Consider deriving from context-aware children.
        return false;
    }

    get data(): TeacherAssessableData {
        const raw: TypeDataMapping['teacher_assessable'] = {
            points: this.points || 0,
            assessed: this._assessed
        };
        if (this.qid) {
            raw.qid = this.qid;
        }
        return raw;
    }

    setData(data: TeacherAssessableData, from: Source, updatedAt?: Date): void {
        if (data.points !== undefined) {
            this.points = data.points;
        }
        if (from === Source.LOCAL) {
            this.save();
        }
        if (updatedAt) {
            this.updatedAt = new Date(updatedAt);
        }
    }
}

export default TeacherAssessable;
