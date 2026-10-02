import type { KtpLesson, ThematicPlan } from "./mock";

export function clonePlan(plan: ThematicPlan): ThematicPlan {
  return JSON.parse(JSON.stringify(plan)) as ThematicPlan;
}

export function createLessonId() {
  return `l-custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function recalculatePlanHours(plan: ThematicPlan): ThematicPlan {
  const themes = plan.themes.map((theme) => ({
    ...theme,
    hours: theme.lessons.reduce((sum, lesson) => sum + lesson.hours, 0),
  }));
  return {
    ...plan,
    themes,
    hours: themes.reduce((sum, theme) => sum + theme.hours, 0),
  };
}

export function rechainPlan(plan: ThematicPlan): ThematicPlan {
  const flat: { themeId: string; lesson: KtpLesson }[] = [];
  for (const theme of plan.themes) {
    for (const lesson of theme.lessons) {
      flat.push({ themeId: theme.id, lesson });
    }
  }

  const themes = plan.themes.map((theme) => ({ ...theme, lessons: [] as KtpLesson[] }));
  const themeById = Object.fromEntries(themes.map((theme) => [theme.id, theme]));

  flat.forEach((entry, index) => {
    const prev = flat[index - 1]?.lesson;
    const next = flat[index + 1]?.lesson;
    themeById[entry.themeId].lessons.push({
      ...entry.lesson,
      number: index + 1,
      prevTopic: prev?.topic,
      nextTopic: next?.topic,
    });
  });

  return recalculatePlanHours({ ...plan, themes });
}

export function removeLessonFromPlan(plan: ThematicPlan, lessonId: string): ThematicPlan {
  const themes = plan.themes.map((theme) => ({
    ...theme,
    lessons: theme.lessons.filter((lesson) => lesson.id !== lessonId),
  }));
  return rechainPlan({ ...plan, themes });
}

export function addLessonToPlan(
  plan: ThematicPlan,
  themeId: string,
  afterLessonId: string | null,
  topic: string,
  lessonKind = "Новая тема",
): { plan: ThematicPlan; lessonId: string } {
  const lessonId = createLessonId();
  const newLesson: KtpLesson = {
    id: lessonId,
    number: 0,
    topic: topic.trim(),
    hours: 1,
    lessonKind,
    status: "planned",
  };

  const themes = plan.themes.map((theme) => {
    if (theme.id !== themeId) return theme;
    if (afterLessonId === null) {
      return { ...theme, lessons: [newLesson, ...theme.lessons] };
    }
    const index = theme.lessons.findIndex((lesson) => lesson.id === afterLessonId);
    if (index < 0) return { ...theme, lessons: [...theme.lessons, newLesson] };
    const lessons = [...theme.lessons];
    lessons.splice(index + 1, 0, newLesson);
    return { ...theme, lessons };
  });

  return { plan: rechainPlan({ ...plan, themes }), lessonId };
}

export function moveLessonInTheme(
  plan: ThematicPlan,
  themeId: string,
  lessonId: string,
  direction: -1 | 1,
): ThematicPlan {
  const themes = plan.themes.map((theme) => {
    if (theme.id !== themeId) return theme;
    const index = theme.lessons.findIndex((lesson) => lesson.id === lessonId);
    if (index < 0) return theme;
    const target = index + direction;
    if (target < 0 || target >= theme.lessons.length) return theme;
    const lessons = [...theme.lessons];
    [lessons[index], lessons[target]] = [lessons[target], lessons[index]];
    return { ...theme, lessons };
  });
  return rechainPlan({ ...plan, themes });
}

export function updateLessonTopic(plan: ThematicPlan, lessonId: string, topic: string): ThematicPlan {
  const themes = plan.themes.map((theme) => ({
    ...theme,
    lessons: theme.lessons.map((lesson) => (lesson.id === lessonId ? { ...lesson, topic: topic.trim() } : lesson)),
  }));
  return rechainPlan({ ...plan, themes });
}

export function updateLessonKind(plan: ThematicPlan, lessonId: string, lessonKind: string): ThematicPlan {
  const themes = plan.themes.map((theme) => ({
    ...theme,
    lessons: theme.lessons.map((lesson) => (lesson.id === lessonId ? { ...lesson, lessonKind } : lesson)),
  }));
  return { ...plan, themes };
}

export function filterPlanByQuery(plan: ThematicPlan, query: string): ThematicPlan {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return plan;

  const themes = plan.themes
    .map((theme) => {
      const themeMatches = theme.title.toLowerCase().includes(normalized);
      const lessons = theme.lessons.filter(
        (lesson) => themeMatches || lesson.topic.toLowerCase().includes(normalized) || String(lesson.number).includes(normalized),
      );
      return { ...theme, lessons };
    })
    .filter((theme) => theme.lessons.length > 0);

  return { ...plan, themes };
}

export function countPlanLessons(plan: ThematicPlan) {
  return plan.themes.reduce((sum, theme) => sum + theme.lessons.length, 0);
}
