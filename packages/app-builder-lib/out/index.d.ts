import { PublishOptions } from "electron-publish/out/publisher";
import { Packager } from "./packager";
import { PackagerOptions } from "./packagerApi";
export { Packager, BuildResult } from "./packager";
export { PackagerOptions, ArtifactCreated, ArtifactBuildStarted } from "./packagerApi";
export { TargetConfiguration, Platform, Target, DIR_TARGET, BeforeBuildContext, SourceRepositoryInfo, TargetSpecificOptions, TargetConfigType, DEFAULT_TARGET, CompressionLevel, } from "./core";
export { getArchSuffix, Arch, archFromString } from "builder-util";
export { Configuration, AfterPackContext, MetadataDirectories } from "./configuration";
export { ElectronBrandingOptions, ElectronDownloadOptions, ElectronPlatformName } from "./electron/ElectronFramework";
export { PlatformSpecificBuildOptions, AsarOptions, FileSet, Protocol, ReleaseInfo } from "./options/PlatformSpecificBuildOptions";
export { FileAssociation } from "./options/FileAssociation";
export { MacConfiguration, DmgOptions, MasConfiguration, MacOsTargetName, DmgContent, DmgWindow } from "./options/macOptions";
export { PkgOptions, PkgBackgroundOptions, BackgroundAlignment, BackgroundScaling } from "./options/pkgOptions";
export { WindowsConfiguration } from "./options/winOptions";
export { AppXOptions } from "./options/AppXOptions";
export { MsiOptions } from "./options/MsiOptions";
export { CommonWindowsInstallerConfiguration } from "./options/CommonWindowsInstallerConfiguration";
export { NsisOptions, NsisWebOptions, PortableOptions, CommonNsisOptions } from "./targets/nsis/nsisOptions";
export { LinuxConfiguration, DebOptions, CommonLinuxOptions, LinuxTargetSpecificOptions, AppImageOptions, FlatpakOptions } from "./options/linuxOptions";
export { SnapOptions } from "./options/SnapOptions";
export { Metadata, AuthorMetadata, RepositoryInfo } from "./options/metadata";
export { AppInfo } from "./appInfo";
export { SquirrelWindowsOptions } from "./options/SquirrelWindowsOptions";
export { WindowsSignOptions, CustomWindowsSignTaskConfiguration, WindowsSignTaskConfiguration, CustomWindowsSign, FileCodeSigningInfo, CertificateFromStoreInfo, } from "./codeSign/windowsCodeSign";
export { CancellationToken, ProgressInfo } from "builder-util-runtime";
export { PublishOptions, UploadTask } from "electron-publish";
export { PublishManager } from "./publish/PublishManager";
export { PlatformPackager } from "./platformPackager";
export { Framework, PrepareApplicationStageDirectoryOptions } from "./Framework";
export { buildForge, ForgeOptions } from "./forge-maker";
export declare function checkBuildRequestOptions(options: PackagerOptions & PublishOptions): void;
export declare function build(options: PackagerOptions & PublishOptions, packager?: Packager): Promise<Array<string>>;
