import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { getSkillName, PREDEFINED_SKILLS } from "@/constants/skills";
import { 
  categoryOrder, 
  getAdaptiveNameFontSize, 
  formatDate,
  type ResumeDocumentProps, 
  formatBday
} from "@/components/pdf/ResumeDocument";

Font.register({
  family: 'JetBrains Mono',
  fonts: [
    { src: '/fonts/JetBrainsMono-ExtraLight.ttf', fontWeight: 200, fontStyle: 'normal' },
    { src: '/fonts/JetBrainsMono-ExtraLightItalic.ttf', fontWeight: 200, fontStyle: 'italic' },
    
    // Light (300)
    { src: '/fonts/JetBrainsMono-Light.ttf', fontWeight: 300, fontStyle: 'normal' },
    { src: '/fonts/JetBrainsMono-LightItalic.ttf', fontWeight: 300, fontStyle: 'italic' },
    
    // Regular (400)
    { src: '/fonts/JetBrainsMono-Regular.ttf', fontWeight: 400, fontStyle: 'normal' },
    { src: '/fonts/JetBrainsMono-Italic.ttf', fontWeight: 400, fontStyle: 'italic' },
    
    // Medium (500)
    { src: '/fonts/JetBrainsMono-Medium.ttf', fontWeight: 500, fontStyle: 'normal' },
    { src: '/fonts/JetBrainsMono-MediumItalic.ttf', fontWeight: 500, fontStyle: 'italic' },
    
    // Bold (700)
    { src: '/fonts/JetBrainsMono-Bold.ttf', fontWeight: 700, fontStyle: 'normal' },
    { src: '/fonts/JetBrainsMono-BoldItalic.ttf', fontWeight: 700, fontStyle: 'italic' },
    
    // ExtraBold (800)
    { src: '/fonts/JetBrainsMono-ExtraBold.ttf', fontWeight: 800, fontStyle: 'normal' },
    { src: '/fonts/JetBrainsMono-ExtraBoldItalic.ttf', fontWeight: 800, fontStyle: 'italic' },
  ],
});

// TUI color palette
const c = {
  bg:        '#1E1E1E',
  text:      '#D4D4D4',
  muted:     '#8A8A8A',
  blue:      '#61AFEE',
  teal:      '#56B6C2',
  pink:      '#E94B6A',
  green:     '#7FBF6A',
  lightGreen:'#B5D982',
  yellow:    '#E8D86E',
  white:     '#FFFFFF',
  border:    '#3A3A3A',
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: c.bg,
    fontFamily: 'JetBrains Mono',
    color: c.text,
  },
  textSection: {
    marginLeft: 12,
    marginHorisontal: 4,
    borderLeftWidth: 2,
    borderLeftColor: c.muted,
    paddingLeft: 10
  },

  // === LEFT COLUMN ===
  leftColumn: {
    width: '32%',
    padding: 22,
    backgroundColor: '#292929',
    borderRightWidth: 2,
    borderRightColor: c.border
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#3A3A3A',
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    color: '#CFCFCF',
    fontSize: 34,
    fontWeight: 700,
  },

  name: {
    color: c.white,
    fontWeight: 700,
    lineHeight: 1.15,
    marginBottom: 2,
  },

  jobTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    marginBottom: 18,
  },
  bulletDot: {
    color: c.white,
    fontSize: 11,
    marginRight: 6,
  },
  jobTitle: {
    color: c.white,
    fontSize: 16,
    fontWeight: 700,
    flex: 1,
    lineHeight: 1.2,
  },

  sidebarSectionTitle: {
    color: c.lightGreen,
    fontWeight: 500,
    fontSize: 16,
    marginTop: 4,
  },
  fieldLabel: {
    color: c.pink,
    fontSize: 9,
    marginTop: 6,
  },
  fieldValue: {
    color: c.text,
    fontSize: 9,
    fontWeight: 500,
    marginBottom: 2,
  },
  contactValue: {
    color: c.text,
    fontSize: 9,
    fontWeight: 500,
    marginBottom: 6,
  },

  // === RIGHT COLUMN ===
  rightColumn: {
    width: '68%',
    padding: 14,
  },

  sectionBlock: {
    borderWidth: 2,
    borderColor: c.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 14,
    paddingBottom: 10,
    marginTop: 14,
    marginBottom: 4,
    position: 'relative',
  },
  sectionTitleWrapper: {
    position: 'absolute',
    top: -10,
    left: 12,
    backgroundColor: c.bg,
    paddingHorizontal: 6,
  },
  sectionTitle: {
    color: c.blue,
    fontSize: 14,
    fontWeight: 700,
  },

  entryContainer: {
    marginBottom: 10,
  },
  entryTitle: {
    color: c.yellow,
    fontSize: 10,
    fontWeight: 700,
    fontStyle: 'italic',
    marginBottom: 1,
  },
  entryTitleInline: {
    color: c.green,
    fontSize: 10,
    fontWeight: 700,
  },
  entrySubtitleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  entrySubtitle: {
    color: c.lightGreen,
    fontSize: 10,
  },
  entryDate: {
    color: c.teal,
    fontSize: 9,
    fontStyle: 'italic',
    marginLeft: 4,
  },
  entryTypeNote: {
    color: c.lightGreen,
    fontSize: 10,
    fontStyle: 'italic',
    marginLeft: 4,
  },
  entryDescription: {
    color: c.text,
    fontSize: 9,
    lineHeight: 1.4,
    marginTop: 4,
  },

  // Skills inline
  skillCategoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  skillCategoryLabel: {
    color: c.teal,
    fontSize: 10,
    fontWeight: 700,
    marginRight: 4,
  },
  skillItem: {
    color: c.text,
    fontSize: 10,
    flex: 1,
  },
});

const TUITemplate: React.FC<ResumeDocumentProps> = ({ data, avatarBase64 }) => {
  const { personalInfo, education, experience, skills, custom } = data;

  const normalizePdfText = (value?: string, maxLength = 160) => {
    const cleaned = (value || "")
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, " ")
      .replace(/[\uD800-\uDFFF]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (cleaned.length <= maxLength) return cleaned;
    return `${cleaned.slice(0, Math.max(1, maxLength - 3))}...`;
  };

  const safeName = normalizePdfText(personalInfo?.name, 42);
  const safeSurname = normalizePdfText(personalInfo?.surname, 42);
  const safeJobTitle = normalizePdfText(personalInfo?.jobTitle, 64);
  const safeAddress = normalizePdfText(personalInfo?.address, 120);
  const safeEmail = normalizePdfText(personalInfo?.email, 64);
  const safePhone = normalizePdfText(personalInfo?.phone, 36);
  const safeWebsite = normalizePdfText(personalInfo?.website?.replace(/^https?:\/\//, ""), 64);
  const safeGithub = normalizePdfText(personalInfo?.github?.replace(/^https?:\/\//, ""), 64);

  const fullName = `${safeName} ${safeSurname}`.trim();
  const avatarInitials = `${safeName[0] || ''}${safeSurname[0] || ''}`.toUpperCase() || "??";

  const skillsByCategory = (skills || []).reduce((acc, skill) => {
    const skillInfo = PREDEFINED_SKILLS.find(s => s.id === skill.SkillId);
    const category = skillInfo?.category || "Другое";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, NonNullable<typeof skills>>);

  const sortedCategories = Object.keys(skillsByCategory).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <View style={styles.sectionBlock}>
      <View style={styles.sectionTitleWrapper}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* === LEFT COLUMN === */}
        <View style={styles.leftColumn}>

          <View style={styles.avatarContainer}>
            {avatarBase64 ? (
              <Image src={avatarBase64} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarPlaceholder}>{avatarInitials}</Text>
            )}
          </View>

          <Text style={[styles.name, { fontSize: getAdaptiveNameFontSize(fullName) }]}>
            {safeName}
          </Text>
          <Text style={[styles.name, { fontSize: getAdaptiveNameFontSize(fullName) }]}>
            {safeSurname}
          </Text>

          {personalInfo?.jobTitle && (
            <View style={styles.jobTitleRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.jobTitle}>{safeJobTitle}</Text>
            </View>
          )}

          <Text style={styles.sidebarSectionTitle}>личная информация</Text>
          <View style={styles.textSection}>
            {personalInfo?.birthDate && (
            <>
              <Text style={styles.fieldLabel}>дата рождения:</Text>
              <Text style={styles.fieldValue}>{formatBday(personalInfo.birthDate)}</Text>
            </>
          )}
          {personalInfo?.address && (
            <>
              <Text style={styles.fieldLabel}>адрес:</Text>
              <Text style={styles.fieldValue}>{safeAddress}</Text>
            </>
          )}
          </View>

          <Text style={styles.sidebarSectionTitle}>контакты</Text>
          <View style={styles.textSection}>
            {personalInfo?.email && (
              <Text style={styles.contactValue}>{safeEmail}</Text>
            )}
            {personalInfo?.phone && (
              <Text style={styles.contactValue}>{safePhone}</Text>
            )}
            {personalInfo?.website && (
              <Text style={styles.contactValue}>{safeWebsite}</Text>
            )}
            {personalInfo?.github && (
              <Text style={styles.contactValue}>{safeGithub}</Text>
            )}
          </View>

        </View>

        {/* === RIGHT COLUMN === */}
        <View style={styles.rightColumn}>

          {education && education.length > 0 && (
            <Section title="образование">
              {education.map((edu, index) => (
                <View key={index} style={styles.entryContainer}>
                  <Text style={styles.entryTitle}>
                    {edu.degree}{edu.faculty ? ` - ${edu.faculty}` : ''}
                  </Text>
                  <View style={styles.entrySubtitleRow}>
                    <Text style={styles.entrySubtitle}>{edu.university}</Text>
                    <Text style={styles.entryDate}>
                      ({formatDate(edu.start_date)} - {edu.end_date ? formatDate(edu.end_date) : "Настоящее время"})
                    </Text>
                  </View>
                  <View style={styles.textSection}>
                  {edu.major && (
                    <Text style={styles.entryDescription}>
                      Специальность: {edu.major}
                    </Text>
                  )}
                  </View>
                </View>
              ))}
            </Section>
          )}

          {experience && experience.length > 0 && (
            <Section title="опыт работы">
              {experience.map((exp, index) => (
                <View key={index} style={styles.entryContainer}>
                  <Text style={styles.entryTitle}>{exp.position}</Text>
                  <View style={styles.entrySubtitleRow}>
                    <Text style={styles.entrySubtitle}>{exp.company}</Text>
                    <Text style={styles.entryDate}>
                      ({formatDate(exp.start_date)} - {formatDate(exp.end_date)})
                    </Text>
                  </View>
                  <View style={styles.textSection}>
                    {exp.description && (
                      <Text style={styles.entryDescription}>{exp.description}</Text>
                    )}
                  </View>
                </View>
              ))}
            </Section>
          )}

          {skills && skills.length > 0 && (
            <Section title="навыки">
              {sortedCategories.map(category => (
                <View key={category} style={styles.skillCategoryRow}>
                  <Text style={styles.skillCategoryLabel}>{category}:</Text>
                  <Text style={styles.skillItem}>
                    {' '}
                    {skillsByCategory[category]
                      .map(s => getSkillName(s.SkillId))
                      .join(', ')}
                  </Text>
                </View>
              ))}
            </Section>
          )}

          {custom && custom.map((item, index) => (
            <Section key={index} title={item.title.toLowerCase()}>
              <View style={styles.textSection}>
              <Text style={styles.entryDescription}>{item.content}</Text>
              </View>
            </Section>
          ))}

        </View>
      </Page>
    </Document>
  );
};

export default TUITemplate;
