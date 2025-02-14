import { AllPublishOptions } from "builder-util-runtime"
import { AppAdapter } from "./AppAdapter"
import { AppUpdater, DownloadExecutorTask } from "./AppUpdater"

export abstract class BaseUpdater extends AppUpdater {
  protected quitAndInstallCalled = false
  private quitHandlerAdded = false

  protected constructor(options?: AllPublishOptions | null, app?: AppAdapter) {
    super(options, app)
  }

  quitAndInstall(isSilent = false, isForceRunAfter = false): void {
    this._logger.info(`Install on explicit quitAndInstall`)
    // If NOT in silent mode use `autoRunAppAfterInstall` to determine whether to force run the app
    const isInstalled = this.install(isSilent, isSilent ? isForceRunAfter : this.autoRunAppAfterInstall)
    if (isInstalled) {
      setImmediate(() => {
        // this event is normally emitted when calling quitAndInstall, this emulates that
        require("electron").autoUpdater.emit("before-quit-for-update")
        this.app.quit()
      })
    } else {
      this.quitAndInstallCalled = false
    }
  }

  protected executeDownload(taskOptions: DownloadExecutorTask): Promise<Array<string>> {
    return super.executeDownload({
      ...taskOptions,
      done: event => {
        this.dispatchUpdateDownloaded(event)
        this.addQuitHandler()
        return Promise.resolve()
      },
    })
  }

  // must be sync
  protected abstract doInstall(options: InstallOptions): boolean

  // must be sync (because quit even handler is not async)
  protected install(isSilent: boolean, isForceRunAfter: boolean): boolean {
    if (this.quitAndInstallCalled) {
      this._logger.warn("install call ignored: quitAndInstallCalled is set to true")
      return false
    }

    const downloadedUpdateHelper = this.downloadedUpdateHelper
    const installerPath = downloadedUpdateHelper == null ? null : downloadedUpdateHelper.file
    const downloadedFileInfo = downloadedUpdateHelper == null ? null : downloadedUpdateHelper.downloadedFileInfo
    if (installerPath == null || downloadedFileInfo == null) {
      this.dispatchError(new Error("No valid update available, can't quit and install"))
      return false
    }

    // prevent calling several times
    this.quitAndInstallCalled = true

    try {
      this._logger.info(`Install: isSilent: ${isSilent}, isForceRunAfter: ${isForceRunAfter}`)
      return this.doInstall({
        installerPath,
        isSilent,
        isForceRunAfter,
        isAdminRightsRequired: downloadedFileInfo.isAdminRightsRequired,
      })
    } catch (e: any) {
      this.dispatchError(e)
      return false
    }
  }

  protected addQuitHandler(): void {
    if (this.quitHandlerAdded || !this.autoInstallOnAppQuit) {
      return
    }

    this.quitHandlerAdded = true

    this.app.onQuit(exitCode => {
      if (this.quitAndInstallCalled) {
        this._logger.info("Update installer has already been triggered. Quitting application.")
        return
      }

      if (!this.autoInstallOnAppQuit) {
        this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.")
        return
      }

      if (exitCode !== 0) {
        this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${exitCode}`)
        return
      }

      this._logger.info("Auto install update on quit")
      this.install(true, false)
    })
  }
}

export interface InstallOptions {
  readonly installerPath: string
  readonly isSilent: boolean
  readonly isForceRunAfter: boolean
  readonly isAdminRightsRequired: boolean
}
