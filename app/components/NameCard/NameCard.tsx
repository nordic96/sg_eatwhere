import { GitHub, LinkedIn } from '@mui/icons-material';
import Home from '@mui/icons-material/Home';

export default function NameCard() {
  return (
    <div className={'py-2 flex grow gap-1 items-center'}>
      <a href={'https://www.linkedin.com/in/gi-hun-ko-863619184/'} target={'_blank'}>
        <LinkedIn />
      </a>
      <a href={'https://github.com/nordic96'} target={'_blank'}>
        <GitHub />
      </a>
      <a href={'https://stephenghk.com'} target={'_blank'}>
        <Home />
      </a>
    </div>
  );
}
