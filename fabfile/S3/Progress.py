## Amazon S3 manager
## Author: Michal Ludvig <michal@logix.cz>
##         http://www.logix.cz/michal
## License: GPL Version 2

import sys
import datetime
import time
import Utils

class Progress(object):
    _stdout = sys.stdout
    _last_display = 0

    def __init__(self, labels, total_size):
        self._stdout = sys.stdout
        self.new_file(labels, total_size)

    def new_file(self, labels, total_size):
        self.labels = labels
        self.total_size = total_size
        # Set initial_position to something in the
        # case we're not counting from 0. For instance
        # when appending to a partially downloaded file.
        # Setting initial_position will let the speed
        # be computed right.
        self.initial_position = 0
        self.current_position = self.initial_position
        self.time_start = datetime.datetime.now()
        self.time_last = self.time_start
        self.time_current = self.time_start

        self.display(new_file = True)

    def update(self, current_position = -1, delta_position = -1):
        self.time_last = self.time_current
        self.time_current = datetime.datetime.now()
        if current_position > -1:
            self.current_position = current_position
        elif delta_position > -1:
            self.current_position += delta_position
        #else:
        #   no update, just call display()
        self.display()

    def done(self, message):
        self.display(done_message = message)

    def output_labels(self):
        self._stdout.write(u"%(source)s -> %(destination)s  %(extra)s\n" % self.labels)
        self._stdout.flush()

    def _display_needed(self):
        # We only need to update the display every so often.
        if time.time() - self._last_display > 1:
            self._last_display = time.time()
            return True
        return False

    def display(self, new_file = False, done_message = None):
        """
        display(new_file = False[/True], done = False[/True])

        Override this method to provide a nicer output.
        """
        if new_file:
            self.output_labels()
            self.last_milestone = 0
            return

        if self.current_position == self.total_size:
            print_size = Utils.formatSize(self.current_position, True)
            if print_size[1] != "": print_size[1] += "B"
            timedelta = self.time_current - self.time_start
            sec_elapsed = timedelta.days * 86400 + timedelta.seconds + float(timedelta.microseconds)/1000000.0
            print_speed = Utils.formatSize((self.current_position - self.initial_position) / sec_elapsed, True, True)
            self._stdout.write("100%%  %s%s in %.2fs (%.2f %sB/s)\n" %
                (print_size[0], print_size[1], sec_elapsed, print_speed[0], print_speed[1]))
            self._stdout.flush()
            return

        rel_position = selfself.current_position * 100 / self.total_size
        if rel_position >= self.last_milestone:
            self.last_milestone = (int(rel_position) / 5) * 5
            self._stdout.write("%d%% ", self.last_milestone)
            self._stdout.flush()
            return

class ProgressANSI(Progress):
    ## http://en.wikipedia.org/wiki/ANSI_escape_code
    SCI = '\x1b['
    ANSI_hide_cursor = SCI + "?25l"
    ANSI_show_cursor = SCI + "?25h"
    ANSI_save_cursor_pos = SCI + "s"
    ANSI_restore_cursor_pos = SCI + "u"
    ANSI_move_cursor_to_column = SCI + "%uG"
    ANSI_erase_to_eol = SCI + "0K"
    ANSI_erase_current_line = SCI + "2K"

    def display(self, new_file = False, done_message = None):
        """
        display(new_file = False[/True], done_message = None)
        """
        if new_file:
            self.output_labels()
            self._stdout.write(self.ANSI_save_cursor_pos)
            self._stdout.flush()
            return

        # Only display progress every so often
        if not (new_file or done_message) and not self._display_needed():
            return

        timedelta = self.time_current - self.time_start
        sec_elapsed = timedelta.days * 86400 + timedelta.seconds + float(timedelta.microseconds)/1000000.0
        if (sec_elapsed > 0):
            print_speed = Utils.formatSize((self.current_position - self.initial_position) / sec_elapsed, True, True)
        else:
            print_speed = (0, "")
        self._stdout.write(self.ANSI_restore_cursor_pos)
        self._stdout.write(self.ANSI_erase_to_eol)
        self._stdout.write("%(current)s of %(total)s   %(percent)3d%% in %(elapsed)ds  %(speed).2f %(speed_coeff)sB/s" % {
            "current" : str(self.current_position).rjust(len(str(self.total_size))),
            "total" : self.total_size,
            "percent" : self.total_size and (self.current_position * 100 / self.total_size) or 0,
            "elapsed" : sec_elapsed,
            "speed" : print_speed[0],
            "speed_coeff" : print_speed[1]
        })

        if done_message:
            self._stdout.write("  %s\n" % done_message)

        self._stdout.flush()

class ProgressCR(Progress):
    ## Uses CR char (Carriage Return) just like other progress bars do.
    CR_char = chr(13)

    def display(self, new_file = False, done_message = None):
        """
        display(new_file = False[/True], done_message = None)
        """
        if new_file:
            self.output_labels()
            return

        # Only display progress every so often
        if not (new_file or done_message) and not self._display_needed():
            return

        timedelta = self.time_current - self.time_start
        sec_elapsed = timedelta.days * 86400 + timedelta.seconds + float(timedelta.microseconds)/1000000.0
        if (sec_elapsed > 0):
            print_speed = Utils.formatSize((self.current_position - self.initial_position) / sec_elapsed, True, True)
        else:
            print_speed = (0, "")
        self._stdout.write(self.CR_char)
        output = " %(current)s of %(total)s   %(percent)3d%% in %(elapsed)4ds  %(speed)7.2f %(speed_coeff)sB/s" % {
            "current" : str(self.current_position).rjust(len(str(self.total_size))),
            "total" : self.total_size,
            "percent" : self.total_size and (self.current_position * 100 / self.total_size) or 0,
            "elapsed" : sec_elapsed,
            "speed" : print_speed[0],
            "speed_coeff" : print_speed[1]
        }
        self._stdout.write(output)
        if done_message:
            self._stdout.write("  %s\n" % done_message)

        self._stdout.flush()

# vim:et:ts=4:sts=4:ai
