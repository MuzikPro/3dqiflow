import { useState } from 'react';
import { AxisWheel } from './components/AxisWheel/AxisWheel';
import { MeridianTheater } from './components/MeridianTheater/MeridianTheater';
import { Formula3D } from './components/Formula3D/Formula3D';
import { ArticleReader } from './components/Reader/ArticleReader';
import { HetuLuoshu } from './components/HetuLuoshu/HetuLuoshu';
import { PulseTongue } from './components/PulseTongue/PulseTongue';
import { AcupointAtlas } from './components/Acupoints/AcupointAtlas';
import { AboutPage } from './components/About/AboutPage';
import { StringKey, t, useLang, setLang } from './i18n';
import { UI, applyUITheme } from './styles/theme';

// owner 2026-08-20：亮色模式下线——五行色与部分文字未为亮底调校。
// 全程锁定暗色；清掉历史 yy_theme 存量，避免旧偏好再次翻转主题。
applyUITheme('dark');
try { localStorage.removeItem('yy_theme'); } catch { /* ignore */ }
import { toggleButtonStyle } from './components/UI/panelStyle';

// owner 2026-08-21 (DELIVERY_MERGE_ENERGY): 节气剧场并入轴轮模型'节气'皮肤, 独立场景下线
type SceneKey = 'axis' | 'meridian' | 'acupoint' | 'formula' | 'hetu' | 'pulse' | 'reader' | 'about';

// owner 2026-08-25：经穴图提为第一项（亦为落地页），轴轮模型移到最后
const SCENE_LABEL_KEYS: Record<SceneKey, StringKey> = {
  acupoint: 'sceneAcupoint',
  meridian: 'sceneMeridian',
  formula: 'sceneFormula',
  hetu: 'sceneHetu',
  pulse: 'scenePulse',
  reader: 'sceneReader',
  axis: 'sceneAxis',
  about: 'sceneAbout'
};

function App() {
  const [scene, setScene] = useState<SceneKey>('acupoint');
  // 双书联动：条文页请求打开某方剂/某经脉的 3D 场景
  const [formulaRequest, setFormulaRequest] = useState<string | null>(null);
  const [meridianRequest, setMeridianRequest] = useState<string | null>(null);
  const [articleRequest, setArticleRequest] = useState<number | null>(null);
  const [pulseRequest, setPulseRequest] = useState<{ pulse: string; tongue: string } | null>(null);
  // owner 2026-08-20：首次引导弹窗下线——落地页直接进轴轮模型。
  // Onboarding 组件保留在 components/ 未引用（同 SettingsModal，待重新安置）。
  // 语言（中/英切换，owner 2026-09-03 复位入口）；主题恒为暗色（见文件头 owner 决定）
  const lang = useLang();

  const openFormula = (name: string) => {
    setFormulaRequest(name);
    setScene('formula');
  };
  const openMeridian = (name: string) => {
    setMeridianRequest(name);
    setScene('meridian');
  };
  const openArticle = (id: number) => {
    setArticleRequest(id);
    setScene('reader');
  };
  const openPulseTongue = (pulse: string, tongue: string) => {
    setPulseRequest({ pulse, tongue });
    setScene('pulse');
  };

  return (
    <div key={lang}>
      {scene === 'axis' && <AxisWheel onOpenFormula={openFormula} onOpenMeridian={openMeridian} />}
      {scene === 'meridian' && (
        <MeridianTheater key={meridianRequest ?? 'default'} initialMeridianName={meridianRequest} />
      )}
      {scene === 'acupoint' && <AcupointAtlas />}
      {scene === 'about' && <AboutPage />}
      {scene === 'formula' && (
        <Formula3D key={formulaRequest ?? 'default'} initialFormulaName={formulaRequest} onOpenArticle={openArticle} />
      )}
      {scene === 'hetu' && <HetuLuoshu />}
      {scene === 'pulse' && (
        <PulseTongue
          key={pulseRequest ? `${pulseRequest.pulse}-${pulseRequest.tongue}` : 'default'}
          onOpenFormula={openFormula}
          onOpenArticle={openArticle}
          initialPulse={pulseRequest?.pulse ?? null}
          initialTongue={pulseRequest?.tongue ?? null}
        />
      )}
      {scene === 'reader' && (
        <ArticleReader
          key={articleRequest ?? 'default'}
          onOpenFormula={openFormula}
          onOpenMeridian={openMeridian}
          onOpenPulseTongue={openPulseTongue}
          initialArticleId={articleRequest}
        />
      )}

      {/* 全局标题栏 + 场景切换（窄屏：标题缩一号、导航横向滑动，见 index.css） */}
      <div
        className="app-header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 110,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 30px',
          background: UI.headerGradient,
          pointerEvents: 'none'
        }}
      >
        <div className="app-header-left" style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: 0, flex: 1 }}>
          <div>
            <div className="app-title" style={{ fontSize: '20px', color: UI.accent, letterSpacing: lang === 'zh' ? '4px' : '1px', whiteSpace: 'nowrap' }}>
              {t(lang, 'appTitle')}
            </div>
            <div className="app-subtitle" style={{ fontSize: '11px', color: UI.textMuted, letterSpacing: lang === 'zh' ? '2px' : '0.5px' }}>
              {t(lang, 'appSubtitle')}
            </div>
          </div>
          <div className="app-nav" style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
            {(Object.keys(SCENE_LABEL_KEYS) as SceneKey[]).map((key) => (
              <button
                key={key}
                style={toggleButtonStyle(scene === key)}
                onClick={() => setScene(key)}
              >
                {t(lang, SCENE_LABEL_KEYS[key])}
              </button>
            ))}
          </div>
        </div>
        {/* 右侧：中/英切换（owner 2026-09-03；主题按钮仍隐藏，SettingsModal 待重新安置） */}
        <button
          style={{ ...toggleButtonStyle(false), pointerEvents: 'auto', whiteSpace: 'nowrap' }}
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          title={lang === 'en' ? '切换到中文' : 'Switch to English'}
        >
          {lang === 'en' ? '中文' : 'EN'}
        </button>
      </div>

    </div>
  );
}

export default App;
