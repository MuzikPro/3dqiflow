import { BACKGROUND, UI, RADIUS } from '@/styles/theme';
import { panelStyle } from '../UI/panelStyle';
import { getAcademicDisclaimer } from '@/utils/academicCheck';
import { tr } from '@/i18n';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '22px' }}>
      <div style={{ fontSize: '13px', color: UI.accent, letterSpacing: '2px', marginBottom: '8px' }}>
        {title}
      </div>
      <div style={{ fontSize: '12px', color: UI.textSecondary, lineHeight: 1.9 }}>{children}</div>
    </section>
  );
}

/**
 * 声明页（owner 2026-08-26）：各页零散的定位方法、三方数据许可、审核状态
 * 与隐私说明集中于此。安全性一句话仍随内容同屏（如经穴图「示意定位，
 * 不可据此在真人取穴」），此页承载全文与出处。
 */
export function AboutPage() {
  return (
    <div className="scene-root" style={{
      width: '100vw', height: '100vh', background: BACKGROUND.gradient,
      overflowY: 'auto', display: 'flex', justifyContent: 'center'
    }}>
      <div style={{
        ...panelStyle, borderRadius: RADIUS.md, margin: '90px 20px 40px',
        padding: '26px 32px', maxWidth: '720px', height: 'fit-content'
      }}>
        <div style={{ fontSize: '20px', color: UI.accent, letterSpacing: '3px', marginBottom: '18px' }}>
          {tr('声明 · 定位方法 / 数据出处 / 隐私')}
        </div>

        <Section title={tr('教育用途')}>
          {tr('本应用是个人学习工具。全部内容——包括方剂、条文解读、脉舌对应、病机标注——')}
          {tr(getAcademicDisclaimer())}{tr('，非医疗建议，不构成诊断或治疗依据。各功能页同屏保留一句教育框定，本页为全文。')}
        </Section>

        <Section title={tr('经穴图 · 坐标的性质与限度')}>
          {tr('穴位坐标为')}<b>{tr('示意定位')}</b>{tr('，按体表标志帧从 2D 图重定位而来，非解剖测量值，')}
          <b>{tr('不可用于在真人身上取穴')}</b>{tr('。可移植的是每穴的「定位」文本（措辞依 GB/T 12346-2021，按学习材料对待）。')}
          <br /><br />
          {tr('女体的穴位按')}<b>{tr('她自己')}</b>{tr('的骨性标志重推（腋/肘/腕/髋/膝/踝各自实测，躯干深度图亦按她的体表），不是把男体坐标搬过来。趾位为按比例映射，非她本人趾骨配准；两具模型的足与手表面均无分趾。')}
        </Section>

        <Section title={tr('三方数据与许可（CC BY 4.0）')}>
          {tr('· 男体体表网格：NIH 3D 条目 3DPX-021022「Body, Male」，Human Reference Atlas 3D Reference Object Library（底层数据：美国国家医学图书馆 Visible Human Male 数据集）。CC BY 4.0。已改动：顶点聚类抽稀（185,314 面 → 19,628 面）并等比缩放平移进项目坐标系；比例未变、几何未变形。')}
          <br />
          {tr('· 女体体表网格：同一 Reference Object Library 的女性皮肤条目（Visible Human Female, NLM）。CC BY 4.0。同法抽稀缩放。')}
          <br />
          {tr('· 椎骨阶梯：HuBMAP CCF 3D Reference Object Library。CC BY 4.0。')}
          <br />
          {tr('· 足趾定位：按 Visible Human Male 下肢趾骨配准（University of Denver Center for Orthopaedic Biomechanics）。CC BY 4.0。')}
          <br />
          {tr('· 定位措辞：GB/T 12346-2021《腧穴名称与定位》，按学习材料对待。')}
          <br />
          {tr('详细核对记录见仓库 public/models/README.md。')}
        </Section>

        <Section title={tr('内容与审核状态')}>
          {tr('条文的病机标注提炼自本条圆运动解读，属学习笔记，未经专家审核。脉舌与圆运动的对应是教学示意，非诊断工具。河图洛书与人体的对应是教学模型。个别无文件出处的功效/主治条目按「模型推导·未经核实」明确标示，不与有出处内容混排，不作为参考内容发布。')}
        </Section>

        <Section title={tr('隐私')}>
          {tr('学习进度与偏好只保存在本机浏览器（localStorage）。无遥测、无第三方跟踪脚本，不向任何服务器上传使用数据。清除浏览器站点数据即清除全部本地进度。')}
          <br />
          {tr('测试期部署设有访问口令（发放的测试账号）——这只是入口的门，不是账号体系：不注册、不记录你的使用，登录状态仅存于你浏览器的签名 cookie（7 天）。')}
        </Section>

        <div style={{ fontSize: '10px', color: UI.textFaint, marginTop: '4px' }}>
          {tr('本页与各页同屏提示共同构成本应用的署名与免责呈现（CC BY 4.0 署名义务落实处）。')}
        </div>
      </div>
    </div>
  );
}
