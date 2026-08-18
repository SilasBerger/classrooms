import Icon from '@mdi/react';
import styles from './styles.module.scss';
import {
    mdiAccountCheck,
    mdiCalendarRemove,
    mdiCheckAll,
    mdiFileDownloadOutline,
    mdiTimerPlayOutline,
    mdiTimerStop,
    mdiTimerStopOutline,
    mdiTrashCanOutline
} from '@mdi/js';
import { IfmColors } from '@tdev-components/shared/Colors';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useStore } from '@tdev-hooks/useStore';
import { useLocation } from '@docusaurus/router';
import { observer } from 'mobx-react-lite';
import User from '@tdev-models/User';
import LiveStatusIndicator from '@tdev-components/LiveStatusIndicator';
import { Role } from '@tdev-api/user';
import clsx from 'clsx';
import Button from '@tdev-components/shared/Button';
import { AttendanceCheckStore } from '@tdev-stores/AttendanceCheckStore';

interface Termin {
    cells: string[];
}

interface Props {
    termine: Termin[];
    terminePraktikum?: Termin[];
}

const PRAKTIKUM_GROUP_NAME_PATTERNS = (klass: string, praktikumGroup: string) => [
    `${klass}-${praktikumGroup}`,
    `${klass} HK${praktikumGroup}`,
    `${klass} HK-${praktikumGroup}`,
    `${klass}-HK-${praktikumGroup}`
];

const takesPlaceToday = (dateInfos: DateInfo[]): DateInfo | undefined => {
    const today = new Date();
    return dateInfos.find(
        (dateInfo) =>
            dateInfo.date.getDate() === today.getDate() &&
            dateInfo.date.getMonth() === today.getMonth() &&
            dateInfo.date.getFullYear() === today.getFullYear()
    );
};

interface DateInfo {
    date: Date;
    praktikumGroup?: string;
}

const dateInfos = (termine: Termin[]): DateInfo[] => {
    return termine.map((termin) => {
        const dateStr = termin.cells[0];
        const [day, month, year] = dateStr.split('.').map(Number);
        return {
            date: new Date(year, month - 1, day),
            praktikumGroup: termin.cells[1] || undefined
        };
    });
};

enum ScheduleType {
    Informatik,
    Praktikum,
    Both,
    Neither
}

interface ScheduleInfo {
    type: ScheduleType;
    praktikumGroup?: string;
}

const getScheduleInfo = (termine: Termin[], terminePraktikum: Termin[]): ScheduleInfo => {
    const informatikToday = takesPlaceToday(dateInfos(termine));
    const praktikumToday = takesPlaceToday(dateInfos(terminePraktikum));

    if (informatikToday && praktikumToday) {
        return {
            type: ScheduleType.Both,
            praktikumGroup: praktikumToday.praktikumGroup
        };
    } else if (informatikToday) {
        return { type: ScheduleType.Informatik };
    } else if (praktikumToday) {
        return {
            type: ScheduleType.Praktikum,
            praktikumGroup: praktikumToday.praktikumGroup
        };
    } else {
        return { type: ScheduleType.Neither };
    }
};

const downloadReport = (students: User[], klass: string, attendanceCheckStore: AttendanceCheckStore) => {
    const reportData: { [key: string]: any } = {};
    students.forEach((student) => {
        reportData[student.id] = {
            firstName: student.firstName,
            lastName: student.lastName,
            seen: attendanceCheckStore.wasSeen(student.id),
            comeOnlineTime: attendanceCheckStore.getComeOnlineTime(student.id)
        };
    });

    const report = {
        timestamp: new Date().toISOString(),
        class: klass,
        data: reportData
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${klass}_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

const StudentBadge = observer(
    ({ user, seen, comeOnlineTime }: { user: User; seen: boolean; comeOnlineTime: number | undefined }) => {
        return (
            <div
                className={clsx(styles.studentBadge, {
                    [styles.offline]: user.connectedClients === 0,
                    [styles.withTiming]: comeOnlineTime !== undefined
                })}
                key={user.id}
            >
                <LiveStatusIndicator userId={user.id} size={0.3} className={styles.liveIndicator} />

                {seen && (
                    <Icon
                        path={mdiAccountCheck}
                        size={0.4}
                        className={styles.seenIndicator}
                        color={IfmColors.primary}
                    />
                )}

                <span>
                    {user.firstName} {user.lastName}
                </span>

                {comeOnlineTime !== undefined && (
                    <span className={clsx('badge', 'badge--info')}>{Math.round(comeOnlineTime)}s</span>
                )}
            </div>
        );
    }
);

const AttendanceList = observer(
    ({
        title,
        onlineStudents,
        offlineStudents,
        klass: klass
    }: {
        title: string;
        onlineStudents: User[];
        offlineStudents: User[];
        klass: string;
    }) => {
        const attendanceCheckStore = useStore('siteStore').attendanceCheckStore;

        return (
            <div>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.studentList}>
                    {(onlineStudents || []).map((user) => (
                        <StudentBadge
                            key={user.id}
                            user={user}
                            seen={attendanceCheckStore.wasSeen(user.id)}
                            comeOnlineTime={attendanceCheckStore.getComeOnlineTime(user.id)}
                        />
                    ))}
                    {(offlineStudents || []).map((user) => (
                        <StudentBadge
                            key={user.id}
                            user={user}
                            seen={attendanceCheckStore.wasSeen(user.id)}
                            comeOnlineTime={attendanceCheckStore.getComeOnlineTime(user.id)}
                        />
                    ))}
                </div>
                <div className={styles.tools}>
                    <Button
                        onClick={() =>
                            downloadReport(
                                [...onlineStudents, ...offlineStudents],
                                klass,
                                attendanceCheckStore
                            )
                        }
                        icon={mdiFileDownloadOutline}
                        color={IfmColors.info}
                        title="Report herunterladen"
                    />

                    <Button
                        onClick={() => attendanceCheckStore.reset()}
                        icon={mdiTrashCanOutline}
                        color={IfmColors.danger}
                        title="Tracking zurücksetzen"
                    />

                    <Button
                        onClick={() => {
                            attendanceCheckStore.toggleTimer();
                            onlineStudents.forEach((student) => {
                                attendanceCheckStore.markAsSeen(student.id);
                            });
                        }}
                        className={clsx(styles.timerButton, {
                            [styles.running]: attendanceCheckStore.timerRunning
                        })}
                        icon={attendanceCheckStore.timerRunning ? mdiTimerStopOutline : mdiTimerPlayOutline}
                        color={attendanceCheckStore.timerRunning ? IfmColors.warning : IfmColors.success}
                        title={attendanceCheckStore.timerRunning ? 'Timer anhalten' : 'Timer starten'}
                    />

                    <span className="badge badge--info">
                        {onlineStudents.length}/{onlineStudents.length + offlineStudents.length}
                    </span>
                </div>
            </div>
        );
    }
);

const AttendanceCheck = observer(({ termine, terminePraktikum }: Props) => {
    const isBrowser = useIsBrowser();
    const userStore = useStore('userStore');
    const attendanceCheckStore = useStore('siteStore').attendanceCheckStore;
    const location = useLocation();

    if (!isBrowser || !userStore.current?.hasElevatedAccess) {
        return null;
    }

    const scheduleInfo = getScheduleInfo(termine, terminePraktikum || []);

    if (scheduleInfo.type === ScheduleType.Neither) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>Anwesenheitskontrolle</h2>
                <div className={styles.noLesson}>
                    <Icon path={mdiCalendarRemove} size={1} color={IfmColors.primary} />
                    <span>Heute findet keine Lektion mit dieser Klasse statt.</span>
                </div>
            </div>
        );
    }

    const klass = location.pathname.split('/')[1];

    const informatikStudents: User[] = userStore.managedUsers
        .filter((u) => u.studentGroups.some((g) => g.name === klass))
        .filter((u) => u.role === Role.STUDENT)
        .sort((a, b) => a.firstName.localeCompare(b.firstName));
    const onlineInformatikStudents: User[] = informatikStudents.filter(
        (student) => student.connectedClients > 0
    );
    const offlineInformatikStudents: User[] = informatikStudents.filter(
        (student) => student.connectedClients === 0
    );

    const praktikumStudents: User[] = scheduleInfo.praktikumGroup
        ? userStore.managedUsers
              .filter((u) =>
                  u.studentGroups.some((g) =>
                      PRAKTIKUM_GROUP_NAME_PATTERNS(klass, scheduleInfo.praktikumGroup!).includes(g.name)
                  )
              )
              .filter((u) => u.role === Role.STUDENT)
              .sort((a, b) => a.firstName.localeCompare(b.firstName))
        : [];
    const onlinePraktikumStudents: User[] = praktikumStudents.filter(
        (student) => student.connectedClients > 0
    );
    const offlinePraktikumStudents: User[] = praktikumStudents.filter(
        (student) => student.connectedClients === 0
    );

    [...onlineInformatikStudents, ...onlinePraktikumStudents].forEach((student) => {
        attendanceCheckStore.markAsSeen(student.id);
    });

    return (
        <div className={styles.container}>
            {(scheduleInfo.type === ScheduleType.Informatik || scheduleInfo.type === ScheduleType.Both) && (
                <AttendanceList
                    title="Anwesenheitskontrolle Informatik"
                    onlineStudents={onlineInformatikStudents}
                    offlineStudents={offlineInformatikStudents}
                    klass={klass}
                />
            )}
            {(scheduleInfo.type === ScheduleType.Praktikum || scheduleInfo.type === ScheduleType.Both) && (
                <AttendanceList
                    title="Anwesenheitskontrolle Praktikum"
                    onlineStudents={onlinePraktikumStudents}
                    offlineStudents={offlinePraktikumStudents}
                    klass={klass}
                />
            )}
        </div>
    );
});

export default AttendanceCheck;
