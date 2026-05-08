import React from 'react';
import type { ResumeDocumentProps, TemplateId } from '@/components/pdf/ResumeDocument';
import MinimalTemplate from '@/components/pdf/templates/MinimalTemplate';
import TUITemplate from './templates/TUITemplate';

interface ResumeDocumentRendererProps extends ResumeDocumentProps {
  templateId?: TemplateId;
}

const templateMap: Record<TemplateId, React.FC<ResumeDocumentProps>> = {
  minimal: MinimalTemplate,
  tui: TUITemplate
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