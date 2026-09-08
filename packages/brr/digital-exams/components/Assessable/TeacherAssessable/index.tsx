import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';
import QuestionCard from '@tdev-components/documents/Assessable/QuestionCard';
import { useStore } from '@tdev-hooks/useStore';
import TeacherAssessableModel, { createModel as createTeacherAssessable } from '@brr/digital-exams/model';

interface Props {
    children?: React.ReactNode[];
}

const TeacherAssessable = observer((props: Props) => {
    const documentStore = useStore('documentStore');
    const fakeDoc: TeacherAssessableModel = createTeacherAssessable(
        {
            id: '365e872c-91f8-4019-9c8b-6aa0e20736c8',
            type: 'teacher_assessable',
            authorId: '5ce09177-ed49-4829-bdb5-a698bf223a0c',
            documentRootId: '56b32593-1581-4cd8-b993-7a37e6b83052',
            createdAt: '2024-06-05T20:00:00.000Z',
            updatedAt: '2024-06-05T20:00:00.000Z',
            parentId: undefined,

            data: {
                points: 0.2,
                assessed: true,
                qud: 2
            }
        },
        documentStore
    ) as TeacherAssessableModel;

    return <QuestionCard doc={fakeDoc}>{props.children}</QuestionCard>;
});

export default TeacherAssessable;
