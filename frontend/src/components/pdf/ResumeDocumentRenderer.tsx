import React from 'react';
import type { ResumeDocumentProps, TemplateId } from '@/components/pdf/ResumeDocument';
import MinimalTemplate from '@/components/pdf/templates/MinimalTemplate';
// import ModernTemplate from '@/components/pdf/templates/ModernTemplate';
// import MinimalTemplate from '@/components/pdf/templates/MinimalTemplate';

interface ResumeDocumentRendererProps extends ResumeDocumentProps {
  templateId?: TemplateId;
}

const templateMap: Record<TemplateId, React.FC<ResumeDocumentProps>> = {
  minimal: MinimalTemplate,
};

const ResumeDocumentRenderer: React.FC<ResumeDocumentRendererProps> = ({
  data,
  avatarBase64,
  templateId = 'minimal',
}) => {
  const Template = templateMap[templateId] ?? MinimalTemplate;
  return <Template data={data} avatarBase64={avatarBase64} />;
};

export default ResumeDocumentRenderer;