import Tooltip, { TooltipProps } from './Tooltip';
import { HelpOutlineOutlined } from '@mui/icons-material';
import { SvgIconOwnProps } from '@mui/material';
import { useTranslations } from 'next-intl';

type HelpTooltipProps = Omit<TooltipProps, 'content'> & {
  msgKey: string;
  iconProps?: SvgIconOwnProps;
};

export default function HelpTooltip({ msgKey, iconProps, ...tooltipProps }: HelpTooltipProps) {
  const tooltipT = useTranslations('Tooltip');
  return (
    <Tooltip {...tooltipProps} content={tooltipT(msgKey)}>
      <HelpOutlineOutlined {...iconProps} />
    </Tooltip>
  );
}
