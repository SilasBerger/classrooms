import { AssessableData, registerAdminEditableDocument } from '@tdev-api/document';
import TeacherAssessable from './model';

// This interface defines the structure of the document we want to store in the DB.
export interface TeacherAssessableData extends AssessableData {
    points: number;
}

declare module '@tdev-api/document' {
    // Defines what data we expect to receive when receiving a teacher_assessable document.
    export interface TypeDataMapping {
        ['teacher_assessable']: TeacherAssessableData;
    }

    // Defines what model we need to create when receiving a teacher_assessable document.
    export interface TypeModelMapping {
        ['teacher_assessable']: TeacherAssessable;
    }

    interface AssessableDataMapping {
        ['teacher_assessable']: TeacherAssessableData;
    }
}

registerAdminEditableDocument('teacher_assessable');
