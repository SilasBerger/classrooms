import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';
import questionCardStyles from '@tdev-components/documents/Assessable/QuestionCard/styles.module.scss';
import { useStore } from '@tdev-hooks/useStore';
import TeacherAssessableModel, { createModel as createTeacherAssessable } from '@brr/digital-exams/model';
import clsx from 'clsx';
import Card from '@tdev-components/shared/Card';
import Button from '@tdev-components/shared/Button';
import { mdiCommentEyeOutline, mdiNewspaperCheck } from '@mdi/js';
import { IfmColors } from '@tdev-components/shared/Colors';
import TeacherAssessablePoints from './PointsInput';

interface Props {
    children?: React.ReactNode[];
    allowSelection?: boolean;
    maxPoints: number;
}

const TeacherAssessable = observer((props: Props) => {
    const documentStore = useStore('documentStore');

    const doc: TeacherAssessableModel = createTeacherAssessable(
        {
            id: '365e872c-91f8-4019-9c8b-6aa0e20736c8',
            type: 'teacher_assessable',
            authorId: '5ce09177-ed49-4829-bdb5-a698bf223a0c',
            documentRootId: '56b32593-1581-4cd8-b993-7a37e6b83052',
            createdAt: '2024-06-05T20:00:00.000Z',
            updatedAt: '2024-06-05T20:00:00.000Z',
            parentId: undefined,

            data: {
                points: 1,
                assessed: true,
                qid: 2
            }
        },
        documentStore
    ) as TeacherAssessableModel;

    return (
        <Card
            classNames={{
                card: clsx(
                    questionCardStyles.questionCard,
                    props.allowSelection && questionCardStyles.allowSelection
                ),
                header: clsx(questionCardStyles.header)
            }}
            style={{
                order: doc.questionIndex
            }}
            header={
                <>
                    <h3 className={clsx(questionCardStyles.questionTitle)}>{doc.displayTitle}</h3>
                    <div className={clsx(questionCardStyles.controlsAndFeedback)}>
                        <Button
                            icon={mdiCommentEyeOutline}
                            color={IfmColors.success}
                            onClick={() => {
                                console.log('Assess button clicked');
                            }}
                        />
                        <span className={'badge badge--secondary'}>
                            <TeacherAssessablePoints doc={doc} /> / {props.maxPoints}{' '}
                            {doc.points === 1 ? 'Punkt' : 'Punkte'}
                        </span>
                    </div>
                </>
            }
        >
            {props.children}
        </Card>
    );
});

export default TeacherAssessable;
