import { countryLabel } from './format';

export type AnomalySeverity = 'high' | 'medium' | 'low';
export type AnomalyCategory =
  | 'Automation & Bots'
  | 'Identity & OS Spoofing'
  | 'Network & Proxy'
  | 'Hardware & Environment'
  | 'Behavioral Biometrics'
  | 'Privacy Tools';

export interface AnomalyDefinition {
  code: string;
  title: string;
  badge: string;
  category: AnomalyCategory;
  severity: AnomalySeverity;
  summary: string;
  whyItMatters: string;
  technicalNote: string;
}

export const ANOMALY_DICTIONARY: Record<string, AnomalyDefinition> = {
  // Automation & Bot frameworks
  AUTOMATION_FRAMEWORK_DETECTED: {
    code: 'AUTOMATION_FRAMEWORK_DETECTED',
    title: 'Automated Browser Controlled by Script',
    badge: 'Bot Automation',
    category: 'Automation & Bots',
    severity: 'high',
    summary:
      'This visitor is running an automated software framework (such as Playwright, Puppeteer, or Selenium) rather than browsing with a standard web browser.',
    whyItMatters:
      'Automated scripts are widely used by fraudsters for scraping, brute-forcing passwords, checkout scalping, and automated account registration.',
    technicalNote:
      'Webdriver runtime flag or browser automation properties were set to true in the window context.',
  },
  CDP_RUNTIME_VALUE_MIRROR_SERIALIZER_ACTIVE: {
    code: 'CDP_RUNTIME_VALUE_MIRROR_SERIALIZER_ACTIVE',
    title: 'Headless Browser Inspector Active',
    badge: 'Headless Bot',
    category: 'Automation & Bots',
    severity: 'high',
    summary:
      'An automated background debugging controller (Chrome DevTools Protocol serializer) is manipulating the browser in stealth mode.',
    whyItMatters:
      'Headless bots use stealth drivers to hide their automation flags; this probe catches the invisible serializer background channel they cannot disable.',
    technicalNote:
      'CDP mirror serializer or injected stealth preload script detected via trapped prototype getters.',
  },
  UNTRUSTED_SYNTHETIC_DOM_EVENTS: {
    code: 'UNTRUSTED_SYNTHETIC_DOM_EVENTS',
    title: 'Fake Artificial Mouse or Keyboard Clicks',
    badge: 'Synthetic Clicks',
    category: 'Automation & Bots',
    severity: 'high',
    summary:
      'Clicks, keypresses, or form submissions were triggered programmatically by JavaScript code rather than physical user actions.',
    whyItMatters:
      'Indicates a script is automatically clicking buttons or filling forms without an actual person touching a mouse or keyboard.',
    technicalNote:
      'Browser event isTrusted flag returned false for one or more critical user interaction events.',
  },
  UNTRUSTED_SYNTHETIC_INPUT_ONLY: {
    code: 'UNTRUSTED_SYNTHETIC_INPUT_ONLY',
    title: 'Scripted Input Without Any Real Interaction',
    badge: 'Fully Synthetic',
    category: 'Automation & Bots',
    severity: 'high',
    summary:
      'Pointer, key, wheel, or touch events were dispatched by script while the page saw no trusted human input at all.',
    whyItMatters:
      'A scripted page that never receives a genuine hardware event is strong evidence of an automated session rather than a person.',
    technicalNote:
      'untrustedByType non-click total > 0 and trustedEventCount == 0.',
  },
  CDP_SERIALIZER_WITH_AUTOMATION: {
    code: 'CDP_SERIALIZER_WITH_AUTOMATION',
    title: 'DevTools Serializer Plus Automation Evidence',
    badge: 'Instrumented Bot',
    category: 'Automation & Bots',
    severity: 'high',
    summary:
      'A DevTools serializer was active while automation, an injected preload, or bot-like behavior was also present.',
    whyItMatters:
      'An open console alone is normal for developers; combined with automation evidence it indicates an instrumented bot.',
    technicalNote:
      'CDP console trap corroborated by WebDriver, automation globals, injected preload, or behavioral bot flags.',
  },
  INJECTED_PRELOAD_DETECTED: {
    code: 'INJECTED_PRELOAD_DETECTED',
    title: 'Injected Preload Script Detected',
    badge: 'Injected Script',
    category: 'Automation & Bots',
    severity: 'high',
    summary:
      'Stack frames reference an anonymous injected preload script rather than a normal page script.',
    whyItMatters:
      'Anti-detect browsers and automation frameworks inject code before the page loads to rewrite fingerprint APIs.',
    technicalNote:
      'Structured CallSite frames with an empty filename and line 1, or <anonymous>:1:.',
  },
  BOT_CONSTANT_VELOCITY_TRAJECTORY: {
    code: 'BOT_CONSTANT_VELOCITY_TRAJECTORY',
    title: 'Robotic Constant-Speed Cursor Movement',
    badge: 'Robotic Cursor',
    category: 'Behavioral Biometrics',
    severity: 'medium',
    summary:
      'The mouse moved across the screen at an unnaturally uniform, constant velocity without natural human acceleration or deceleration.',
    whyItMatters:
      'Humans accelerate when moving a mouse and slow down before clicking; mathematical constant velocity is a hallmark of basic automation scripts.',
    technicalNote:
      'Velocity standard deviation over mean velocity fell below 0.12 across pointer event stream.',
  },
  BOT_COLLINEAR_STRAIGHT_LINE_MOUSE: {
    code: 'BOT_COLLINEAR_STRAIGHT_LINE_MOUSE',
    title: 'Perfect Straight-Line Cursor Trajectory',
    badge: 'Straight-Line Path',
    category: 'Behavioral Biometrics',
    severity: 'medium',
    summary:
      'The mouse moved in a mathematically straight geometric line across a long distance, which is physically impossible for human hands.',
    whyItMatters:
      'Automated software coordinates generate point-to-point straight vectors instead of natural curved paths with physiological tremor.',
    technicalNote:
      'Path straightness ratio exceeded 98.5% over a total travel distance greater than 200 pixels.',
  },
  BOT_SYNTHETIC_TIMER_POLLING_CADENCE: {
    code: 'BOT_SYNTHETIC_TIMER_POLLING_CADENCE',
    title: 'Scripted Timer Movement Cadence',
    badge: 'Clockwork Moves',
    category: 'Behavioral Biometrics',
    severity: 'medium',
    summary:
      'Mouse events arrived at rigid, clock-like millisecond intervals generated by a software timer loop.',
    whyItMatters:
      'Bot scripts dispatch simulated mouse movements using setInterval or requestAnimationFrame loops with zero natural timing variation.',
    technicalNote:
      'Standard deviation of inter-event delta-time fell below 0.15 milliseconds.',
  },
  BOT_TELEPORTATION_CLICK_WITHOUT_APPROACH: {
    code: 'BOT_TELEPORTATION_CLICK_WITHOUT_APPROACH',
    title: 'Instant Click Without Cursor Approach',
    badge: 'Teleport Click',
    category: 'Behavioral Biometrics',
    severity: 'medium',
    summary:
      'A click appeared out of nowhere on an element without the cursor ever moving toward it or hovering over it first.',
    whyItMatters:
      'Humans naturally move their mouse toward a button before clicking; automated scripts often click directly at target coordinates.',
    technicalNote:
      'Mouse or pen click registered with fewer than 3 preceding pointer movement coordinates. Touch taps are excluded because touch input has no hover approach.',
  },
  BOT_SYNTHETIC_SCROLL_STEP_FUNCTION: {
    code: 'BOT_SYNTHETIC_SCROLL_STEP_FUNCTION',
    title: 'Artificially Stepped Scrolling',
    badge: 'Synthetic Scroll',
    category: 'Behavioral Biometrics',
    severity: 'medium',
    summary:
      'Page scrolling occurred in rigid, identical step sizes at exact mathematical intervals.',
    whyItMatters:
      'Scraping bots scroll pages using automated step commands rather than human finger swiping or mouse wheel inertia.',
    technicalNote:
      'Scroll delta standard deviation fell below 0.01 with standard deviation of delta-time below 0.15ms.',
  },
  BOT_SYNTHETIC_KEYSTROKE_CADENCE: {
    code: 'BOT_SYNTHETIC_KEYSTROKE_CADENCE',
    title: 'Instant Machine Typing Speed',
    badge: 'Instant Typing',
    category: 'Behavioral Biometrics',
    severity: 'high',
    summary:
      'Text was entered into inputs at superhuman speed with near-zero millisecond keypress hold times (dwell).',
    whyItMatters:
      'Indicates automated form autofill scripts or automated credential stuffing tools blasting credentials into inputs.',
    technicalNote:
      'Mean keystroke dwell time fell below 12ms or standard deviation of dwell was under 1.5ms.',
  },
  SYNTHETIC_TOUCH_CADENCE: {
    code: 'SYNTHETIC_TOUCH_CADENCE',
    title: 'Timer-Perfect Synthetic Touch Stream',
    badge: 'Synthetic Touch',
    category: 'Behavioral Biometrics',
    severity: 'medium',
    summary:
      'Six or more taps had constant pressure and contact size plus either a timer-identical inter-tap interval or fixed coordinates.',
    whyItMatters:
      'Real fingers vary pressure and timing; modern phones legitimately report constant pressure, so this rule requires the synthetic cadence as well.',
    technicalNote:
      'Touch downs >= 6, zero pressure/contact-size variance (when reported), and std(inter-tap dt) < 1.5 ms or coordinate jitter < 0.5 px.',
  },
  MOBILE_STATIC_TOUCH_PRESSURE_EMULATOR: {
    code: 'MOBILE_STATIC_TOUCH_PRESSURE_EMULATOR',
    title: 'Emulated Mobile Touch Screen',
    badge: 'Emulated Touch',
    category: 'Behavioral Biometrics',
    severity: 'medium',
    summary:
      'Touch events reported an unvarying, static pressure value typical of a desktop browser simulating a mobile phone screen.',
    whyItMatters:
      'Common when attackers run mobile device emulators on desktop servers to exploit mobile-only promotions or APIs.',
    technicalNote:
      'Touch pressure variance across interaction points was under 1e-9 with a non-zero mean.',
  },

  // Identity & OS Spoofing
  OS_TCP_TTL_MISMATCH_WINDOWS_ON_UNIX_STACK: {
    code: 'OS_TCP_TTL_MISMATCH_WINDOWS_ON_UNIX_STACK',
    title: 'Operating System Mismatch: Linux Server Claiming Windows',
    badge: 'OS Mismatch (Linux/Win)',
    category: 'Identity & OS Spoofing',
    severity: 'high',
    summary:
      'The visitor claimed to be using a Windows PC, but network packet analysis proves the connection originated from a Linux server or virtual machine.',
    whyItMatters:
      'This is a major indicator of anti-detect browser farms (like Dolphin Anty or AdsPower) running on cloud servers to disguise automated fraud as genuine consumer PCs.',
    technicalNote:
      'User-Agent claimed Windows, but SYN packet incoming network TTL was <= 64 (native to Linux/Unix kernels) rather than 128 (Windows).',
  },
  OS_TCP_TTL_MISMATCH_UNIX_ON_WINDOWS_STACK: {
    code: 'OS_TCP_TTL_MISMATCH_UNIX_ON_WINDOWS_STACK',
    title: 'Operating System Mismatch: Windows Host Claiming Mac/Linux',
    badge: 'OS Mismatch (Win/Mac)',
    category: 'Identity & OS Spoofing',
    severity: 'high',
    summary:
      'The visitor claimed to be on a Mac or Linux device, but the underlying network packet fingerprints reveal a physical Windows host.',
    whyItMatters:
      'Fraudsters often spoof their User-Agent to appear as iPhones or Macs to bypass device bans or fraud heuristics.',
    technicalNote:
      'User-Agent claimed Unix/Apple/Android, but network packet TTL arrived with initial TTL of 128 (Windows kernel stack).',
  },
  PROTOTYPE_PROXY_SPOOFING_DETECTED: {
    code: 'PROTOTYPE_PROXY_SPOOFING_DETECTED',
    title: 'Browser API Tampering & Prototype Poisoning',
    badge: 'API Tampering',
    category: 'Identity & OS Spoofing',
    severity: 'high',
    summary:
      'Standard web browser properties were intercepted and faked by a proxy injection script or anti-detect browser extension.',
    whyItMatters:
      'Authentic web browsers never wrap core properties in Proxy objects. This proves the visitor is deliberately trying to deceive device identification.',
    technicalNote:
      'Object prototype tampering or Proxy wrapper detected on core navigator or screen properties.',
  },
  CROSS_REALM_OR_WORKER_SPOOF_MISMATCH: {
    code: 'CROSS_REALM_OR_WORKER_SPOOF_MISMATCH',
    title: 'Contradictory Browser Identity Across Worker Scopes',
    badge: 'Scope Mismatch',
    category: 'Identity & OS Spoofing',
    severity: 'high',
    summary:
      'The browser reported one set of hardware and platform details in the main window, but a different set inside background Web Workers or iframes.',
    whyItMatters:
      'Anti-detect spoofing extensions frequently forget to patch isolated Web Worker environments, revealing the real underlying machine.',
    technicalNote:
      'Discrepancy detected between main window navigator and unpatched iframe or Web Worker scope.',
  },
  UA_CH_PLATFORM_CONTRADICTS_USER_AGENT: {
    code: 'UA_CH_PLATFORM_CONTRADICTS_USER_AGENT',
    title: 'Platform Contradiction in Client Hints',
    badge: 'Platform Spoof',
    category: 'Identity & OS Spoofing',
    severity: 'medium',
    summary:
      'The modern Client Hints platform header directly contradicted the operating system reported by the User-Agent string.',
    whyItMatters:
      'Occurs when an attacker changes their User-Agent header but fails to update the newer Sec-CH-UA platform headers.',
    technicalNote:
      'Sec-CH-UA-Platform header does not match operating system claimed in standard User-Agent header.',
  },
  UA_CH_ARCHITECTURE_CONTRADICTS_RENDERER: {
    code: 'UA_CH_ARCHITECTURE_CONTRADICTS_RENDERER',
    title: 'CPU Architecture Contradicts Graphics Card',
    badge: 'Arch Mismatch',
    category: 'Identity & OS Spoofing',
    severity: 'medium',
    summary:
      'The claimed processor architecture (e.g. ARM) does not match the graphics card vendor reported by WebGL.',
    whyItMatters:
      'Signs of a spoofed browser profile with mismatched hardware components.',
    technicalNote:
      'Sec-CH-UA-Arch header conflicts with WebGL graphics renderer capabilities.',
  },
  H2_UA_FAMILY_MISMATCH: {
    code: 'H2_UA_FAMILY_MISMATCH',
    title: 'Network Protocol Order Contradicts Browser Type',
    badge: 'Protocol Mismatch',
    category: 'Identity & OS Spoofing',
    severity: 'medium',
    summary:
      'The visitor claimed to be using one browser (e.g., Safari or Chrome), but the low-level HTTP/2 connection frame order belongs to a completely different browser family.',
    whyItMatters:
      'Attackers can change browser headers in code, but cannot easily alter the low-level TLS and HTTP/2 packet sequence of their HTTP client library.',
    technicalNote:
      'HTTP/2 pseudo-header stream order contradicts claimed User-Agent browser family.',
  },
  FEATURE_PROBE_API_TAMPERED: {
    code: 'FEATURE_PROBE_API_TAMPERED',
    title: 'Browser Feature Checks Faked',
    badge: 'Feature API Tamper',
    category: 'Identity & OS Spoofing',
    severity: 'high',
    summary:
      'The browser’s CSS feature-detection API failed native integrity checks, meaning the page can fabricate its reported feature set.',
    whyItMatters:
      'Spoofing tools often replace CSS.supports so the browser reports any capabilities the attacker wants, bypassing engine-version checks.',
    technicalNote:
      'CSS.supports failed the native-source or invalid-property/selector/true-value canaries in the 55-bit feature probe.',
  },
  FEATURE_ENGINE_FAMILY_CONTRADICTION: {
    code: 'FEATURE_ENGINE_FAMILY_CONTRADICTION',
    title: 'Feature Set Matches a Different Browser Engine',
    badge: 'Engine Mismatch',
    category: 'Identity & OS Spoofing',
    severity: 'high',
    summary:
      'The browser’s actual CSS and JavaScript capabilities match another engine family (Chrome, Firefox, or Safari) far better than the browser it claims to be.',
    whyItMatters:
      'A Firefox User-Agent cannot change Blink-only APIs. This catches anti-detect profiles that spoof the UA string but keep the real engine.',
    technicalNote:
      'The observed mask had at least two mismatches against the claimed family while an alternative engine family fit with at most one mismatch.',
  },
  FEATURE_IMPOSSIBLE_FUTURE_PRESENCE: {
    code: 'FEATURE_IMPOSSIBLE_FUTURE_PRESENCE',
    title: 'Browser Exposes Features From a Newer Version',
    badge: 'Future Features',
    category: 'Identity & OS Spoofing',
    severity: 'medium',
    summary:
      'The browser reports CSS or JavaScript features that did not exist in the version it claims to be running.',
    whyItMatters:
      'An older claimed version with newer capabilities usually means the User-Agent was lowered to bypass version gates while the real browser is newer.',
    technicalNote:
      'At least two observed feature bits were unsupported by the claimed engine/version in the pinned Can I Use matrix; a single core-ladder feature scores 20.',
  },
  FEATURE_CORE_SYNTAX_ABSENCE: {
    code: 'FEATURE_CORE_SYNTAX_ABSENCE',
    title: 'Baseline Browser Features Are Missing',
    badge: 'Core Features Missing',
    category: 'Identity & OS Spoofing',
    severity: 'medium',
    summary:
      'The browser is missing core CSS or JavaScript syntax that every browser of its claimed version and family supports.',
    whyItMatters:
      'Common in outdated headless builds or stripped-down runtimes given a modern User-Agent to look like a current consumer browser.',
    technicalNote:
      'At least two core-ladder or engine-marker features expected by the claimed version were absent from the observed mask.',
  },
  FEATURE_VERSION_SKEW_DETECTED: {
    code: 'FEATURE_VERSION_SKEW_DETECTED',
    title: 'Feature Set Indicates a Different Browser Version',
    badge: 'Version Mismatch',
    category: 'Identity & OS Spoofing',
    severity: 'medium',
    summary:
      'The observed feature set fits a materially different version range than the one the browser claims.',
    whyItMatters:
      'Version strings are trivial to edit, but the engine version that actually executes the page reveals the real release range.',
    technicalNote:
      'Claimed version fell outside the inferred range by more than one Safari/iOS major or five Chrome/Firefox/Edge majors.',
  },
  OS_SPEECH_SYNTHESIS_VOICE_CONTRADICTION: {
    code: 'OS_SPEECH_SYNTHESIS_VOICE_CONTRADICTION',
    title: 'System Voices Contradict Claimed OS',
    badge: 'Voice Mismatch',
    category: 'Identity & OS Spoofing',
    severity: 'high',
    summary:
      'The text-to-speech voice pack installed on this computer belongs to an entirely different operating system (e.g., Apple Siri voices installed on a supposed Windows PC).',
    whyItMatters:
      'Definitive proof of OS spoofing. Browser extensions can fake the User-Agent, but the operating system voice engine exposes the real physical OS.',
    technicalNote:
      'Installed speech synthesis voice families conflict with claimed operating system.',
  },
  OS_SYSTEM_FONT_CONTRADICTION: {
    code: 'OS_SYSTEM_FONT_CONTRADICTION',
    title: 'System Fonts Contradict Operating System',
    badge: 'Font Mismatch',
    category: 'Identity & OS Spoofing',
    severity: 'medium',
    summary:
      'The system fonts rendered by the browser are missing core native fonts for the claimed operating system, or contain fonts unique to another OS.',
    whyItMatters:
      'Confirms spoofed environment where the browser header was changed but the physical OS fonts remain unchanged.',
    technicalNote:
      'Font metric probe detected font discrepancies incompatible with the claimed OS family.',
  },

  // Hardware & Virtualization
  VM_OR_SOFTWARE_GPU_RENDERER: {
    code: 'VM_OR_SOFTWARE_GPU_RENDERER',
    title: 'Software Virtual Machine Graphics Card',
    badge: 'Virtual Machine',
    category: 'Hardware & Environment',
    severity: 'high',
    summary:
      'Graphics are being rendered by a software CPU emulator (such as SwiftShader, LLVMpipe, or VirtualBox) rather than a physical hardware graphics card.',
    whyItMatters:
      'Legitimate consumers browse on physical laptops, desktops, or phones with real GPUs. Software emulators indicate virtual machines or cloud server farms.',
    technicalNote:
      'WebGL unmasked renderer contains software virtualization signatures (e.g. SwiftShader, llvmpipe, VirtualBox, QEMU).',
  },
  SOFTWARE_WEBGPU_ADAPTER: {
    code: 'SOFTWARE_WEBGPU_ADAPTER',
    title: 'Emulated WebGPU Graphics Adapter',
    badge: 'Software WebGPU',
    category: 'Hardware & Environment',
    severity: 'medium',
    summary:
      'The modern WebGPU interface is backed by a CPU software fallback rather than dedicated graphics hardware.',
    whyItMatters:
      'Common in headless browser clusters running on headless cloud servers.',
    technicalNote:
      'WebGPU requestAdapter returned a software or CPU fallback adapter.',
  },
  GPU_PERFORMANCE_CONTRADICTS_CLAIMED_RENDERER: {
    code: 'GPU_PERFORMANCE_CONTRADICTS_CLAIMED_RENDERER',
    title: 'High-End GPU Claimed but Benchmarks Very Slow',
    badge: 'GPU Spoofed',
    category: 'Hardware & Environment',
    severity: 'high',
    summary:
      'The browser claims to have a high-end dedicated GPU (e.g., NVIDIA RTX or Apple M-series), but execution micro-benchmarks ran 10x to 50x slower than real hardware.',
    whyItMatters:
      'Fraudulent anti-detect browsers spoof their GPU name to look like expensive gaming rigs, but cannot fake actual silicon execution speed.',
    technicalNote:
      'WebGL shader execution and clear-buffer timings diverged significantly from hardware baseline expectations.',
  },
  GPU_CPU_TIMING_DIVERGENCE: {
    code: 'GPU_CPU_TIMING_DIVERGENCE',
    title: 'Abnormal GPU to CPU Execution Timing',
    badge: 'Timing Divergence',
    category: 'Hardware & Environment',
    severity: 'medium',
    summary:
      'Execution speeds between the graphics chip and the CPU showed unnatural timing disparities typical of emulation.',
    whyItMatters:
      'Indicates a virtualized hypervisor where graphics calls are intercepted or software-rendered.',
    technicalNote:
      'WebGL execution micro-benchmarks diverged from WebAssembly CPU timing measurements.',
  },
  HIGH_HYPERVISOR_CPU_STEAL_JITTER: {
    code: 'HIGH_HYPERVISOR_CPU_STEAL_JITTER',
    title: 'Cloud Hypervisor CPU Jitter Detected',
    badge: 'Cloud Hypervisor',
    category: 'Hardware & Environment',
    severity: 'medium',
    summary:
      'CPU execution timers suffered from high jitter and pauses ("CPU steal time") characteristic of multi-tenant cloud servers (e.g., AWS, GCP, Azure).',
    whyItMatters:
      'Suggests the visitor is running inside a cloud server container rather than a physical personal computer.',
    technicalNote:
      'WebAssembly high-resolution timer probe measured jitter ratio greater than 6.5.',
  },
  WASM_WALL_CLOCK_SKEW_DETECTED: {
    code: 'WASM_WALL_CLOCK_SKEW_DETECTED',
    title: 'Tampered Browser Performance Timers',
    badge: 'Tampered Timers',
    category: 'Hardware & Environment',
    severity: 'medium',
    summary:
      'The high-precision performance timer in the browser is desynchronized or being artificially manipulated by anti-fingerprinting extensions.',
    whyItMatters:
      'Indicates timer resolution clamping or tampering intended to evade biometric and timing-based fingerprinting.',
    technicalNote:
      'WebAssembly wall-clock calibration diverged from performance.now() progression.',
  },
  IMPOSSIBLE_APPLE_SILICON_CORE_COUNT: {
    code: 'IMPOSSIBLE_APPLE_SILICON_CORE_COUNT',
    title: 'Impossible Apple Silicon CPU Specification',
    badge: 'Fake Apple Silicon',
    category: 'Hardware & Environment',
    severity: 'high',
    summary:
      'The device claims to be an Apple M-series Mac, but reports a CPU core count that has never physically existed on genuine Apple Silicon hardware.',
    whyItMatters:
      'Definitive evidence of fraudulent profile generation: the bot generator randomly selected Apple hardware but configured an impossible core count.',
    technicalNote:
      'Claimed Apple M-series GPU renderer paired with fewer than 4 hardware CPU cores.',
  },
  PRIVACY_CLAMPED_CORES: {
    code: 'PRIVACY_CLAMPED_CORES',
    title: 'Privacy Browser Clamped CPU Core Count',
    badge: 'Privacy Clamp',
    category: 'Privacy Tools',
    severity: 'low',
    summary:
      'Firefox/Tor or another privacy-hardened browser reported two or four cores on an Apple Silicon profile.',
    whyItMatters:
      'ResistFingerprinting reduces the reported core count; treating that as a spoofed Apple GPU would punish privacy-conscious users.',
    technicalNote:
      'Apple renderer, cores 2 or 4, and Firefox/Tor family or privacy-tool evidence; weighted in the PrivacyTool domain.',
  },
  FEATURE_OPTIONAL_API_RESTRICTED: {
    code: 'FEATURE_OPTIONAL_API_RESTRICTED',
    title: 'Optional Browser APIs Restricted',
    badge: 'Optional APIs Off',
    category: 'Privacy Tools',
    severity: 'low',
    summary:
      'Several permission-gated or privacy-sensitive browser APIs (such as WebGPU, Bluetooth, or SharedArrayBuffer) were unavailable while core browser features were intact.',
    whyItMatters:
      'Typical of privacy-hardened browsers, extensions, or enterprise policies. This is intentionally informational and does not count as spoofing.',
    technicalNote:
      'No impossible-presence or core-absence mismatch, but at least two secure-context optional APIs were absent; weighted 10 in the PrivacyTool domain.',
  },
  APPLE_SILICON_WITHOUT_P3_GAMUT_DISPLAY: {
    code: 'APPLE_SILICON_WITHOUT_P3_GAMUT_DISPLAY',
    title: 'Claimed Apple Mac Lacks Wide Color Screen',
    badge: 'Display Contradiction',
    category: 'Hardware & Environment',
    severity: 'medium',
    summary:
      'The visitor claims to be using an Apple Silicon Mac or iPad, but the display reports no support for the wide P3 color gamut built into all genuine Apple screens.',
    whyItMatters:
      'Reveals a virtual machine or non-Apple monitor running a spoofed macOS user profile.',
    technicalNote:
      'Display color-gamut media query returned false for p3 on claimed Apple Silicon hardware.',
  },
  WEBGPU_COMPUTE_ATOMIC_SOFTWARE_EMULATION: {
    code: 'WEBGPU_COMPUTE_ATOMIC_SOFTWARE_EMULATION',
    title: 'Software Emulation in WebGPU Compute Shaders',
    badge: 'Shader Emulation',
    category: 'Hardware & Environment',
    severity: 'high',
    summary:
      'WebGPU compute shader execution demonstrated software emulation rather than hardware silicon execution.',
    whyItMatters:
      'Points directly to a containerized headless environment attempting to simulate modern graphics capabilities.',
    technicalNote:
      'Compute atomic shader execution time exceeded hardware threshold baseline.',
  },
  GPU_ADAPTER_CONTRADICTION: {
    code: 'GPU_ADAPTER_CONTRADICTION',
    title: 'Conflicting Graphics Card Hardware Info',
    badge: 'GPU Contradiction',
    category: 'Hardware & Environment',
    severity: 'low',
    summary:
      'WebGL and WebGPU reported contradictory graphics chip manufacturers or driver versions.',
    whyItMatters:
      'Suggests partial spoofing where only one graphics API was modified.',
    technicalNote:
      'Discrepancy detected between WebGL unmasked vendor/renderer and WebGPU adapter info.',
  },

  // Network & Proxy
  RESIDENTIAL_PROXY_TCP_TLS_RTT_SPLIT: {
    code: 'RESIDENTIAL_PROXY_TCP_TLS_RTT_SPLIT',
    title: 'Residential Proxy Relay Detected',
    badge: 'Residential Proxy',
    category: 'Network & Proxy',
    severity: 'high',
    summary:
      'Connection timing reveals traffic is being forwarded through a residential proxy node before reaching your server.',
    whyItMatters:
      'Residential proxies (e.g. BrightData, Oxylabs, IPRoyal) are heavily utilized by credential stuffers and fraud rings to disguise cloud attacks as residential home users.',
    technicalNote:
      'Severe divergence between TCP handshake round-trip time and TLS cryptographic handshake round-trip time (>50ms split).',
  },
  MSS_CLAMP_OBSERVED: {
    code: 'MSS_CLAMP_OBSERVED',
    title: 'Low SYN MSS (Solo Signal)',
    badge: 'MSS Observation',
    category: 'Network & Proxy',
    severity: 'low',
    summary:
      'The client SYN advertised an MSS below 1390, which is common on PPPoE, DS-Lite, and corporate VPNs.',
    whyItMatters:
      'A solo MSS clamp is not evidence of fraud; it is recorded at low weight and escalates only with another tunnel signal.',
    technicalNote:
      'Non-mobile TCP MSS < 1390 without a TTL mismatch, zero-hop TTL, or TCP/TLS RTT split.',
  },
  CHALLENGE_IP_DRIFT: {
    code: 'CHALLENGE_IP_DRIFT',
    title: 'Same Network, Different Address',
    badge: 'Address Drift',
    category: 'Network & Proxy',
    severity: 'low',
    summary:
      'The challenge and ingest requests came from different addresses inside the same bound network.',
    whyItMatters:
      'Dual-stack and carrier CGNAT rotate addresses routinely; this is a soft signal, not a rejection.',
    technicalNote:
      'Primary network binding verified, exact-IP tag differed; accepted in prefix mode.',
  },
  WASM_PROOF_TAMPERED: {
    code: 'WASM_PROOF_TAMPERED',
    title: 'Payload Spliced After WASM Probe',
    badge: 'Proof Mismatch',
    category: 'Identity & OS Spoofing',
    severity: 'high',
    summary:
      'The WASM payload proof did not match the high-value fields in the decrypted payload.',
    whyItMatters:
      'A mismatch means the JSON was edited after the WASM probe ran, a common proxy-injection technique.',
    technicalNote:
      'Recomputed canonical payload digest and envelope proof failed against the payload envelopeProof.',
  },
  VPN_TUNNEL_MSS_CLAMP_WITH_TTL_SHIFT: {
    code: 'VPN_TUNNEL_MSS_CLAMP_WITH_TTL_SHIFT',
    title: 'VPN or Encrypted Tunnel Detected',
    badge: 'VPN / Tunnel',
    category: 'Network & Proxy',
    severity: 'medium',
    summary:
      'Network packet headers exhibit clamping and TTL alterations caused by VPN tunnel encapsulation (e.g., WireGuard or OpenVPN).',
    whyItMatters:
      'The visitor is routing their traffic through an anonymizing VPN or encrypted tunnel to mask their true geographic location.',
    technicalNote:
      'TCP Maximum Segment Size (MSS) clamped below 1390 bytes combined with routing hop shifts.',
  },
  PROXY_TUNNEL_RTT_DIVERGENCE: {
    code: 'PROXY_TUNNEL_RTT_DIVERGENCE',
    title: 'Local vs Network Latency Discrepancy',
    badge: 'Proxy Tunnel',
    category: 'Network & Proxy',
    severity: 'medium',
    summary:
      'The browser internal round-trip timing contradicts the public network round-trip timing, indicating an intermediary proxy.',
    whyItMatters:
      'Indicates traffic is taking an indirect detour through a proxy or relay server.',
    technicalNote:
      'Discrepancy greater than 150ms between WebRTC peer round-trip time and HTTP round-trip time.',
  },
  ANOMALOUS_ZERO_HOP_REMOTE_TTL: {
    code: 'ANOMALOUS_ZERO_HOP_REMOTE_TTL',
    title: 'Abnormal Routing: Zero Internet Hops',
    badge: 'Zero-Hop Packet',
    category: 'Network & Proxy',
    severity: 'medium',
    summary:
      'Packets arrived with an intact initial TTL, as if they originated from the exact same local network, despite arriving from a public internet address.',
    whyItMatters:
      'Indicates local network packet translation, reverse tunneling, or a packet injection proxy.',
    technicalNote:
      'Observed TCP TTL matches initial baseline without normal internet hop count decay.',
  },
  WEBRTC_LOCAL_IP_EXPOSED: {
    code: 'WEBRTC_LOCAL_IP_EXPOSED',
    title: 'Local Private Network IP Leaked',
    badge: 'IP Leak',
    category: 'Network & Proxy',
    severity: 'low',
    summary:
      'WebRTC candidate negotiation revealed a local network IP address.',
    whyItMatters:
      'Useful for cross-session correlation and identifying users behind shared corporate proxies or NAT gateways.',
    technicalNote:
      'WebRTC host candidate revealed private RFC-1918 IPv4 or ULA IPv6 network address.',
  },

  // Privacy Tools & Anti-fingerprinting
  CANVAS_NOISE_FARBLING_DETECTED: {
    code: 'CANVAS_NOISE_FARBLING_DETECTED',
    title: 'Canvas Fingerprint Noise Injection (Farbling)',
    badge: 'Canvas Farbling',
    category: 'Privacy Tools',
    severity: 'medium',
    summary:
      'The browser is injecting subtle random noise into canvas image exports to prevent tracking.',
    whyItMatters:
      'Built-in feature of privacy browsers (such as Brave or Firefox with resistFingerprinting enabled), or dedicated anti-fingerprinting extensions.',
    technicalNote:
      'Sub-pixel noise farbling detected across successive canvas readbacks.',
  },
  CANVAS_WEBGL_TEXTURE_BRIDGE_MISMATCH: {
    code: 'CANVAS_WEBGL_TEXTURE_BRIDGE_MISMATCH',
    title: 'Canvas Tampering Contradicts 3D Hardware',
    badge: 'Canvas Hooked',
    category: 'Privacy Tools',
    severity: 'medium',
    summary:
      'The browser 2D drawing canvas has been hooked or altered, but does not match the 3D graphics texture readback.',
    whyItMatters:
      'Indicates an extension or browser spoofing tool that hooked 2D canvas functions but missed 3D GPU textures.',
    technicalNote:
      'Discrepancy detected between 2D canvas pixel data and WebGL texture bridge readback.',
  },

  // Behavior Engine Summary
  BEHAVIOR_ENGINE: {
    code: 'BEHAVIOR_ENGINE',
    title: 'Suspicious Behavioral Biometrics',
    badge: 'Biometric Risk',
    category: 'Behavioral Biometrics',
    severity: 'high',
    summary:
      'The visitor demonstrated non-human interaction patterns, such as robotic cursor movements, machine keystroke timings, or synthetic DOM clicks.',
    whyItMatters:
      'Human users exhibit natural physiological jitter, curved paths, and reaction pauses; automated tools produce mathematical precision.',
    technicalNote:
      'Composite score penalty contributed by the high-frequency behavioral analysis pipeline.',
  },
};

/**
 * Returns user-friendly information for any anomaly code, with a clear fallback for unknown codes.
 */
export function getAnomalyInfo(code: string): AnomalyDefinition {
  if (ANOMALY_DICTIONARY[code]) {
    return ANOMALY_DICTIONARY[code];
  }

  // Fallback for custom or future engine rules
  const readableTitle = code
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    code,
    title: readableTitle,
    badge: readableTitle.slice(0, 16),
    category: 'Automation & Bots',
    severity: 'medium',
    summary: `The engine flagged an anomaly rule (${code}) during session evaluation.`,
    whyItMatters:
      'This signal contributed to the overall session risk score.',
    technicalNote: `Engine anomaly rule '${code}' triggered during evaluation.`,
  };
}

export interface ExecutiveVerdict {
  status: 'safe' | 'caution' | 'critical';
  headline: string;
  summary: string;
  recommendedAction: string;
  badgeLabel: string;
  badgeClass: string;
  borderClass: string;
  bgGlowClass: string;
}

/**
 * Evaluates the session to produce a plain-English, executive verdict for non-technical users.
 */
export function getExecutiveVerdict(session: {
  riskScore: number;
  spoofAndAutomationScore: number;
  privacyToolDetected: boolean;
  findings?: { code: string; score: number }[];
  anomalies?: string[];
}): ExecutiveVerdict {
  const { riskScore, spoofAndAutomationScore, privacyToolDetected } = session;
  const findings = session.findings ?? [];
  const codes = new Set(
    (session.anomalies ?? []).concat(findings.map((f) => f.code)),
  );

  // Critical Automation or Hard Spoofing
  if (
    riskScore >= 70 ||
    spoofAndAutomationScore >= 70 ||
    codes.has('AUTOMATION_FRAMEWORK_DETECTED') ||
    codes.has('CDP_SERIALIZER_WITH_AUTOMATION') ||
    codes.has('INJECTED_PRELOAD_DETECTED') ||
    codes.has('WASM_PROOF_TAMPERED') ||
    codes.has('UNTRUSTED_SYNTHETIC_INPUT_ONLY') ||
    // Historical rows written before the domain rework.
    codes.has('CDP_RUNTIME_VALUE_MIRROR_SERIALIZER_ACTIVE') ||
    codes.has('OS_TCP_TTL_MISMATCH_WINDOWS_ON_UNIX_STACK') ||
    codes.has('IMPOSSIBLE_APPLE_SILICON_CORE_COUNT') ||
    codes.has('GPU_PERFORMANCE_CONTRADICTS_CLAIMED_RENDERER')
  ) {
    let specificDetail =
      'High-risk automated script, headless browser, or spoofed device environment detected.';
    if (
      codes.has('AUTOMATION_FRAMEWORK_DETECTED') ||
      codes.has('CDP_SERIALIZER_WITH_AUTOMATION') ||
      codes.has('INJECTED_PRELOAD_DETECTED') ||
      codes.has('CDP_RUNTIME_VALUE_MIRROR_SERIALIZER_ACTIVE')
    ) {
      specificDetail =
        'An automated browser framework (e.g., Playwright, Puppeteer) was detected operating in stealth mode.';
    } else if (codes.has('OS_TCP_TTL_MISMATCH_WINDOWS_ON_UNIX_STACK')) {
      specificDetail =
        'The device claims to be a Windows PC, but network packet analysis reveals it is running from a Linux cloud server or emulator.';
    } else if (codes.has('RESIDENTIAL_PROXY_TCP_TLS_RTT_SPLIT')) {
      specificDetail =
        'The visitor is routing traffic through a residential proxy network typical of credential stuffing botnets.';
    }

    return {
      status: 'critical',
      headline: 'Automated Bot or Spoofed Device Detected',
      summary: `${specificDetail} The connection exhibits severe contradictions between claimed browser identity, network telemetry, and physical hardware behavior.`,
      recommendedAction:
        'Block, challenge with strong step-up verification (e.g., SMS/authenticator OTP), or flag transaction for manual fraud review.',
      badgeLabel: 'High Risk · Bot / Spoofing',
      badgeClass: 'border-rose-500/40 bg-rose-500/15 text-rose-700 dark:text-rose-300',
      borderClass: 'border-rose-500/30',
      bgGlowClass: 'from-rose-500/10 via-rose-500/[0.03] to-transparent',
    };
  }

  // Caution: privacy tools or medium/high findings. Low-severity observations
  // (soft MSS clamp, address drift) stay informational.
  const hasMediumOrHigh = Array.from(codes).some((code) => {
    const definition = ANOMALY_DICTIONARY[code];
    return definition !== undefined && definition.severity !== 'low';
  });
  if (riskScore >= 30 || privacyToolDetected || hasMediumOrHigh) {
    let cautionDetail =
      'The visitor appears to be a real user, but is using privacy-enhancing browser tools, VPNs, or proxy relays.';
    if (privacyToolDetected) {
      cautionDetail =
        'The visitor is using a privacy-hardened browser (like Brave or Firefox ResistFingerprinting) which injects noise to protect personal privacy.';
    } else if (codes.has('VPN_TUNNEL_MSS_CLAMP_WITH_TTL_SHIFT')) {
      cautionDetail =
        'The visitor is connected through an encrypted VPN tunnel or commercial anonymizer.';
    }

    return {
      status: 'caution',
      headline: 'Suspicious Traffic or Privacy Guard Active',
      summary: `${cautionDetail} While not inherently malicious, traffic masking tools are sometimes used to disguise location or circumvent regional rules.`,
      recommendedAction:
        'Allow normal browsing; prompt for lightweight verification (e.g., email confirmation) only during sensitive actions like payment or password changes.',
      badgeLabel: 'Moderate Risk · Review Signals',
      badgeClass: 'border-amber-500/40 bg-amber-500/15 text-amber-800 dark:text-amber-300',
      borderClass: 'border-amber-500/30',
      bgGlowClass: 'from-amber-500/10 via-amber-500/[0.03] to-transparent',
    };
  }

  // Safe: Clean session
  return {
    status: 'safe',
    headline: 'Likely Genuine Human User',
    summary:
      'All physical hardware benchmarks, network packet signatures, and human interaction patterns match a real person browsing on an authentic, untampered device.',
    recommendedAction:
      'No action needed. Safe to proceed with normal checkout, account creation, or login.',
    badgeLabel: 'Clean Session · Genuine Human',
    badgeClass: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300',
    borderClass: 'border-emerald-500/30',
    bgGlowClass: 'from-emerald-500/10 via-emerald-500/[0.03] to-transparent',
  };
}

export interface BehaviorInsight {
  label: string;
  value: string;
  status: 'natural' | 'suspicious' | 'neutral';
  explanation: string;
}

export function interpretBehavior(
  behavior: {
    pointerEventCount?: number;
    keyEventCount?: number;
    scrollEventCount?: number;
    meanVelocity?: number;
    p90Jerk?: number;
    pathStraightnessRatio?: number;
    meanDwellMs?: number;
    rolloverRatio?: number;
  } = {},
  anomalies: string[] = [],
): {
  insights: BehaviorInsight[];
  overallHumanScore: number;
  overallVerdict: string;
} {
  const insights: BehaviorInsight[] = [];
  const anomalySet = new Set(anomalies);
  let humanScore = 85;

  const pointerCount = behavior.pointerEventCount ?? 0;
  const keyCount = behavior.keyEventCount ?? 0;
  const scrollCount = behavior.scrollEventCount ?? 0;
  const straightness = behavior.pathStraightnessRatio ?? 0;
  const meanDwell = behavior.meanDwellMs ?? 0;

  // 1. Mouse movement naturalness
  if (pointerCount === 0) {
    insights.push({
      label: 'Mouse Movement',
      value: 'No Pointer Activity',
      status: 'neutral',
      explanation:
        'No mouse movement was captured. The visitor might be on a mobile touch screen or the page was submitted without mouse interaction.',
    });
  } else if (
    anomalySet.has('BOT_COLLINEAR_STRAIGHT_LINE_MOUSE') ||
    straightness > 0.985
  ) {
    humanScore -= 35;
    insights.push({
      label: 'Mouse Movement',
      value: 'Unnaturally Straight Lines (Bot-like)',
      status: 'suspicious',
      explanation:
        'The cursor moved across the screen in mathematically straight geometric lines with zero human curvature or hand tremor.',
    });
  } else if (anomalySet.has('BOT_CONSTANT_VELOCITY_TRAJECTORY')) {
    humanScore -= 30;
    insights.push({
      label: 'Mouse Movement',
      value: 'Robotic Constant Speed',
      status: 'suspicious',
      explanation:
        'The cursor moved at a static, unvarying speed without natural human acceleration and deceleration.',
    });
  } else {
    insights.push({
      label: 'Mouse Movement',
      value: 'Natural Human Curvature',
      status: 'natural',
      explanation:
        'Cursor trajectory showed natural physiological curves, acceleration arcs, and normal tremor.',
    });
  }

  // 2. Typing & Keystroke Rhythm
  if (keyCount === 0) {
    insights.push({
      label: 'Keyboard Interaction',
      value: 'No Typing Captured',
      status: 'neutral',
      explanation:
        'No keyboard events were recorded during this session (no form inputs were filled or keys pressed).',
    });
  } else if (
    anomalySet.has('BOT_SYNTHETIC_KEYSTROKE_CADENCE') ||
    (meanDwell > 0 && meanDwell < 15)
  ) {
    humanScore -= 35;
    insights.push({
      label: 'Keyboard Interaction',
      value: 'Superhuman Machine Speed',
      status: 'suspicious',
      explanation:
        'Keys were pressed and released at millisecond speeds typical of automated autofill scripts or credential-stuffing tools.',
    });
  } else {
    insights.push({
      label: 'Keyboard Interaction',
      value: 'Natural Human Typing Cadence',
      status: 'natural',
      explanation:
        'Keystroke dwell and inter-key flight times matched typical human typing rhythms and muscle reaction times.',
    });
  }

  // 3. Scrolling Style
  if (scrollCount === 0) {
    insights.push({
      label: 'Page Scrolling',
      value: 'No Scrolling',
      status: 'neutral',
      explanation:
        'The visitor stayed in one position without scrolling down the page.',
    });
  } else if (anomalySet.has('BOT_SYNTHETIC_SCROLL_STEP_FUNCTION')) {
    humanScore -= 25;
    insights.push({
      label: 'Page Scrolling',
      value: 'Mechanical Stepped Scroll',
      status: 'suspicious',
      explanation:
        'Page scroll steps arrived in identical pixel increments at exact millisecond timer intervals.',
    });
  } else {
    insights.push({
      label: 'Page Scrolling',
      value: 'Smooth Human Scrolling',
      status: 'natural',
      explanation:
        'Scroll gestures exhibited natural finger drag and wheel deceleration momentum.',
    });
  }

  // Synthetic DOM events
  if (
    anomalySet.has('UNTRUSTED_SYNTHETIC_INPUT_ONLY') ||
    anomalySet.has('UNTRUSTED_SYNTHETIC_DOM_EVENTS')
  ) {
    humanScore -= 40;
    insights.push({
      label: 'Event Authenticity',
      value: 'Untrusted Synthetic Events',
      status: 'suspicious',
      explanation:
        'Pointer, key, wheel, or touch events were generated directly by JavaScript code rather than genuine hardware user input.',
    });
  }
  if (anomalySet.has('SYNTHETIC_TOUCH_CADENCE')) {
    humanScore -= 20;
    insights.push({
      label: 'Touch Dynamics',
      value: 'Timer-Perfect Touch Stream',
      status: 'suspicious',
      explanation:
        'Tap pressure, contact size, timing, and coordinates were too uniform to come from a physical finger.',
    });
  }

  const overallHumanScore = Math.max(0, Math.min(100, humanScore));
  let overallVerdict = 'Normal human interaction patterns';
  if (overallHumanScore < 40) {
    overallVerdict = 'Robotic or scripted interaction patterns';
  } else if (overallHumanScore < 70) {
    overallVerdict = 'Mixed or limited behavioral signals';
  }

  return {
    insights,
    overallHumanScore,
    overallVerdict,
  };
}

export function interpretNetwork(
  edge: {
    country?: string | null;
    countryName?: string | null;
    city?: string | null;
    asn?: number | null;
    asOrganization?: string | null;
    tcpTtl?: number | null;
    tcpMss?: number | null;
    tcpRttMs?: number | null;
    tlsRttMs?: number | null;
  } = {},
  anomalies: string[] = [],
): {
  networkType: string;
  networkBadgeClass: string;
  locationSummary: string;
  osPacketMatch: { status: 'match' | 'mismatch' | 'unknown'; detail: string };
  latencySummary: string;
} {
  const anomalySet = new Set(anomalies);
  const locationSummary = countryLabel(edge);

  // Network Type
  let networkType = 'Standard Consumer Internet (ISP)';
  let networkBadgeClass = 'text-emerald-800 dark:text-emerald-300 border-emerald-500/30 bg-emerald-500/10';

  if (anomalySet.has('RESIDENTIAL_PROXY_TCP_TLS_RTT_SPLIT')) {
    networkType = 'Residential Proxy Relay (Traffic forwarded)';
    networkBadgeClass = 'text-rose-700 dark:text-rose-300 border-rose-500/30 bg-rose-500/10';
  } else if (anomalySet.has('VPN_TUNNEL_MSS_CLAMP_WITH_TTL_SHIFT')) {
    networkType = 'VPN or Encrypted Tunnel (Packet encapsulation)';
    networkBadgeClass = 'text-amber-800 dark:text-amber-300 border-amber-500/30 bg-amber-500/10';
  } else if (anomalySet.has('MSS_CLAMP_OBSERVED')) {
    networkType = 'Consumer Access with MSS Clamp (PPPoE/DS-Lite)';
    networkBadgeClass = 'text-amber-800 dark:text-amber-300 border-amber-500/30 bg-amber-500/10';
  } else if (
    edge.asOrganization &&
    /amazon|google|microsoft|digitalocean|ovh|hetzner|linode|vultr|cloudflare|alibaba|tencent/i.test(
      edge.asOrganization,
    )
  ) {
    networkType = 'Datacenter / Cloud Server Host';
    networkBadgeClass = 'text-amber-800 dark:text-amber-300 border-amber-500/30 bg-amber-500/10';
  }

  // OS packet match
  let osPacketMatch: {
    status: 'match' | 'mismatch' | 'unknown';
    detail: string;
  } = {
    status: 'match',
    detail: 'Low-level network packets match the operating system reported by the browser.',
  };

  if (anomalySet.has('OS_TCP_TTL_MISMATCH_WINDOWS_ON_UNIX_STACK')) {
    osPacketMatch = {
      status: 'mismatch',
      detail:
        'Spoofing detected: Browser claims Windows, but network packets originate from a Linux server kernel.',
    };
  } else if (anomalySet.has('OS_TCP_TTL_MISMATCH_UNIX_ON_WINDOWS_STACK')) {
    osPacketMatch = {
      status: 'mismatch',
      detail:
        'Spoofing detected: Browser claims Mac/Linux, but network packets reveal a physical Windows host.',
    };
  } else if (!edge.tcpTtl) {
    osPacketMatch = {
      status: 'unknown',
      detail: 'Network packet TTL was not captured for this connection.',
    };
  }

  // Latency
  let latencySummary = 'Normal network response time';
  if (edge.tcpRttMs !== null && edge.tcpRttMs !== undefined) {
    if (edge.tcpRttMs < 35) {
      latencySummary = `Fast connection (${Math.round(edge.tcpRttMs)}ms ping)`;
    } else if (edge.tcpRttMs < 120) {
      latencySummary = `Moderate latency (${Math.round(edge.tcpRttMs)}ms ping)`;
    } else {
      latencySummary = `High latency (${Math.round(edge.tcpRttMs)}ms ping)`;
    }
  }

  return {
    networkType,
    networkBadgeClass,
    locationSummary,
    osPacketMatch,
    latencySummary,
  };
}

