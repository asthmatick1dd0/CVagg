import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { getSkillName, PREDEFINED_SKILLS } from "@/constants/skills";
import { 
  categoryOrder, 
  getAdaptiveNameFontSize, 
  formatDate,
  type ResumeDocumentProps 
} from "@/components/pdf/ResumeDocument";

Font.register({
  family: 'Fira Code',
  fonts: [
    { src: '/fonts/FiraCode-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/FiraCode-Bold.ttf', fontWeight: 'bold' },
  ],
});

// IDE color palette (matching the mockup)
const c = {
  bg:        '#1E1E1E',  // near-black background
  text:      '#D4D4D4',  // base text
  muted:     '#8A8A8A',  // labels like "date of birth:"
  blue:      '#61AFEE',  // right headers
  teal:      '#56B6C2',  // dates
  pink:      '#E94B6A',  // section titles, bullet
  green:     '#7FBF6A',  // job titles / position
  lightGreen:'#B5D982',  // company / university (italic)
  yellow:    '#E8D86E',  // dates
  white:     '#FFFFFF',  // name
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: c.bg,
    fontFamily: 'Fira Code',
    color: c.text,
  },

  // === LEFT COLUMN ===
  leftColumn: {
    width: '32%',
    padding: 22,
    backgroundColor: '#292929',
    borderRightWidth: '1px',
    borderRightColor: 'grey'
  },
  avatarContainer: {
    width: 95,
    height: 95,
    borderRadius: 47.5,
    backgroundColor: '#292929',
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
    color: '#555',
    fontSize: 28,
  },

  name: {
    color: c.white,
    fontWeight: 'bold',
    lineHeight: 1.15,
    marginBottom: 2,
  },

  jobTitleRow: {
    color: 'white',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 16,
  },
  bulletSquare: {
    color: c.pink,
    fontSize: 9,
    marginRight: 6,
    marginTop: 1,
  },
  jobTitle: {
    color: c.pink,
    fontSize: 10,
    flex: 1,
  },

  sidebarSectionTitle: {
    color: c.pink,
    fontSize: 13,
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginTop: 14,
    marginBottom: 8,
  },
  fieldLabel: {
    color: c.muted,
    fontSize: 9,
    marginTop: 6,
  },
  fieldValue: {
    color: c.text,
    fontSize: 9,
    marginBottom: 2,
  },
  contactValue: {
    color: c.text,
    fontSize: 9,
    marginBottom: 6,
  },

  // === RIGHT COLUMN ===
  rightColumn: {
    width: '68%',
    padding: 22,
    paddingLeft: 8,
  },
  sectionTitle: {
    color: c.blue,
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 8,
    marginLeft: 20,
  },
  entryContainer: {
    borderWidth: '1px',
    borderColor: 'grey',
    marginBottom: 10,
  },
  entryTitle: {
    color: c.yellow,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  entrySubtitleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  entrySubtitle: {
    color: c.yellow,
    fontSize: 10,
  },
  entryDate: {
    color: c.teal,
    fontSize: 9,
    marginLeft: 4,
  },
  entryDescription: {
    color: c.text,
    fontSize: 9,
    lineHeight: 1.4,
    marginTop: 3,
    paddingLeft: 8,
  },

  // Skills inline
  skillCategoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  skillCategoryLabel: {
    color: c.lightGreen,
    fontSize: 10,
    marginRight: 4,
  },
  skillItem: {
    color: c.text,
    fontSize: 10,
  },
});

const TUITemplate: React.FC<ResumeDocumentProps> = ({ data, avatarBase64 }) => {
  const { personalInfo, education, experience, skills, custom } = data;

  const fullName = `${personalInfo?.name || ''} ${personalInfo?.surname || ''}`.trim();

  // Group skills
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* === LEFT COLUMN === */}
        <View style={styles.leftColumn}>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {avatarBase64 ? (
              <Image src={avatarBase64} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarPlaceholder}>◭</Text>
            )}
          </View>

          {/* Name */}
          <Text style={[styles.name, { fontSize: getAdaptiveNameFontSize(fullName) }]}>
            {personalInfo?.name}
          </Text>
          <Text style={[styles.name, { fontSize: getAdaptiveNameFontSize(fullName) }]}>
            {personalInfo?.surname}
          </Text>

          {/* Job title */}
          {personalInfo?.jobTitle && (
            <View style={styles.jobTitleRow}>
              <Text style={styles.bulletSquare}>■</Text>
              <Text style={styles.jobTitle}>{personalInfo.jobTitle}</Text>
            </View>
          )}

          {/* personal info */}
          <Text style={styles.sidebarSectionTitle}>personal info</Text>
          {personalInfo?.birthDate && (
            <>
              <Text style={styles.fieldLabel}>date of birth:</Text>
              <Text style={styles.fieldValue}>{personalInfo.birthDate}</Text>
            </>
          )}
          {personalInfo?.address && (
            <>
              <Text style={styles.fieldLabel}>location:</Text>
              <Text style={styles.fieldValue}>{personalInfo.address}</Text>
            </>
          )}

          {/* contacts */}
          <Text style={styles.sidebarSectionTitle}>contacts</Text>
          {personalInfo?.email && (
            <Text style={styles.contactValue}>{personalInfo.email}</Text>
          )}
          {personalInfo?.phone && (
            <Text style={styles.contactValue}>{personalInfo.phone}</Text>
          )}
          {personalInfo?.website && (
            <Text style={styles.contactValue}>{personalInfo.website}</Text>
          )}
          {personalInfo?.github && (
            <Text style={styles.contactValue}>{personalInfo.github}</Text>
          )}

        </View>

        {/* === RIGHT COLUMN === */}
        <View style={styles.rightColumn}>

          {/* education */}
          {education && education.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>education</Text>
              {education.map((edu, index) => (
                <View key={index} style={styles.entryContainer}>
                  <Text style={styles.entryTitle}>
                    {edu.degree}{edu.faculty ? ` of ${edu.faculty}` : ''}
                  </Text>
                  <View style={styles.entrySubtitleRow}>
                    <Text style={styles.entrySubtitle}>{edu.university}</Text>
                    <Text style={styles.entryDate}>
                      ({formatDate(edu.start_date)} - {edu.end_date ? formatDate(edu.end_date) : "Present"})
                    </Text>
                  </View>
                  {edu.major && (
                    <Text style={styles.entryDescription}>
                      Specialization name: {edu.major}
                    </Text>
                  )}
                </View>
              ))}
            </>
          )}

          {/* work experience */}
          {experience && experience.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>work experience</Text>
              {experience.map((exp, index) => (
                <View key={index} style={styles.entryContainer}>
                  <Text style={styles.entryTitle}>{exp.position}</Text>
                  <View style={styles.entrySubtitleRow}>
                    <Text style={styles.entrySubtitle}>{exp.company}</Text>
                    <Text style={styles.entryDate}>
                      ({formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : "Present"})
                    </Text>
                  </View>
                  {exp.description && (
                    <Text style={styles.entryDescription}>{exp.description}</Text>
                  )}
                </View>
              ))}
            </>
          )}

          {/* technical skills */}
          {skills && skills.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>technical skills</Text>
              {sortedCategories.map(category => (
                <View key={category} style={styles.skillCategoryRow}>
                  <Text style={styles.skillCategoryLabel}>{category}:</Text>
                  <Text style={styles.skillItem}>
                    {skillsByCategory[category]
                      .map(s => getSkillName(s.SkillId))
                      .join(', ')}
                  </Text>
                </View>
              ))}
            </>
          )}

          {/* custom sections */}
          {custom && custom.map((item, index) => (
            <View key={index}>
              <Text style={styles.sectionTitle}>{item.title}</Text>
              <Text style={styles.entryDescription}>{item.content}</Text>
            </View>
          ))}

        </View>
      </Page>
    </Document>
  );
};

export default TUITemplate;