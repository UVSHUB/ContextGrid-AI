import chokidar, { FSWatcher } from 'chokidar';
import simpleGit, { SimpleGit } from 'simple-git';
import WebSocket from 'ws';
import path from 'path';

export interface GitDeltaPayload {
  type: 'WORKSPACE_GIT_DELTA';
  source: 'WORKING_TREE' | 'STAGED' | 'BRANCH_COMPARISON';
  changedFile: string;
  diffContent: string;
  branch: string;
  timestamp: string;
}

export class WorkspaceGitWatcher {
  private git: SimpleGit;
  private watcher: FSWatcher | null = null;
  private targetDirectory: string;

  constructor(targetDirectory: string = process.cwd()) {
    this.targetDirectory = targetDirectory;
    this.git = simpleGit(targetDirectory);
  }

  public startWatching(onGitDelta: (delta: GitDeltaPayload) => void) {
    console.log(`[GitWatcher] Monitoring workspace changes in ${this.targetDirectory}`);

    this.watcher = chokidar.watch(this.targetDirectory, {
      ignored: /(^|[\/\\])(\..|node_modules|\.next|dist|venv)/,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: { stabilityThreshold: 300, pollInterval: 100 }
    });

    this.watcher.on('change', async (filePath: string) => {
      if (/\.(ts|tsx|js|jsx|py)$/.test(filePath)) {
        await this.handleFileChange(filePath, onGitDelta);
      }
    });
  }

  private async handleFileChange(filePath: string, callback: (delta: GitDeltaPayload) => void) {
    try {
      const status = await this.git.status();
      const currentBranch = status.current || 'main';

      let diffContent = await this.git.diff([filePath]);
      let diffSource: 'WORKING_TREE' | 'STAGED' | 'BRANCH_COMPARISON' = 'WORKING_TREE';

      if (!diffContent) {
        diffContent = await this.git.diff(['--staged', filePath]);
        diffSource = 'STAGED';
      }

      if (!diffContent) {
        try {
          diffContent = await this.git.diff([`main...HEAD`, '--', filePath]);
          diffSource = 'BRANCH_COMPARISON';
        } catch (e) {}
      }

      callback({
        type: 'WORKSPACE_GIT_DELTA',
        source: diffSource,
        changedFile: filePath,
        diffContent: diffContent || `Modified file ${filePath.split('/').pop()}`,
        branch: currentBranch,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.warn('[GitWatcher] Error computing Git diff:', err);
    }
  }

  public stopWatching() {
    if (this.watcher) {
      this.watcher.close();
      console.log('[GitWatcher] Stopped watching workspace.');
    }
  }
}
